"""
Plant Disease Classifier API
-----------------------------
Loads a trained Keras model (model.keras) + class names (class_names.pkl)
and serves predictions over a simple REST API.

Run locally:
    pip install fastapi uvicorn tensorflow pillow numpy python-multipart
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Then test:
    curl -X POST "http://localhost:8000/predict" -F "file=@leaf.jpg"

Docs (Swagger UI) will be available at:
    http://localhost:8000/docs
"""

from pathlib import Path
import pickle
import logging

import numpy as np
from io import BytesIO
from PIL import Image, UnidentifiedImageError

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from tensorflow.keras.models import load_model

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "model.keras"
CLASS_NAMES_PATH = BASE_DIR / "class_names.pkl"
IMG_SIZE = (128, 128)          # must match the size the model was trained on
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
MAX_FILE_SIZE_MB = 10

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("plant-disease-api")

# --------------------------------------------------------------------------
# App + model loading (loaded once at startup, not per-request)
# --------------------------------------------------------------------------
app = FastAPI(
    title="Plant Disease Classifier",
    description="Upload a leaf image and get a disease prediction.",
    version="1.0.0",
)

# Allow calls from a frontend running on a different origin (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # tighten this to your actual frontend domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = None
CLASS_NAMES = None


@app.on_event("startup")
def load_artifacts():
    global MODEL, CLASS_NAMES

    if not MODEL_PATH.exists():
        raise RuntimeError(f"Model file not found at {MODEL_PATH}")
    if not CLASS_NAMES_PATH.exists():
        raise RuntimeError(f"Class names file not found at {CLASS_NAMES_PATH}")

    logger.info("Loading model from %s ...", MODEL_PATH)
    MODEL = load_model(MODEL_PATH)

    with open(CLASS_NAMES_PATH, "rb") as f:
        CLASS_NAMES = pickle.load(f)

    logger.info("Loaded model with %d output classes.", len(CLASS_NAMES))

    # Sanity check: model's output size should match number of class names
    output_units = MODEL.output_shape[-1]
    if output_units != len(CLASS_NAMES):
        logger.warning(
            "Model outputs %d units but there are %d class names — "
            "predictions may be mislabeled.",
            output_units, len(CLASS_NAMES)
        )


# --------------------------------------------------------------------------
# Response schema
# --------------------------------------------------------------------------
class PredictionItem(BaseModel):
    disease: str
    confidence: float


class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    top3: list[PredictionItem]


# --------------------------------------------------------------------------
# Core prediction logic
# --------------------------------------------------------------------------
def run_prediction(image_bytes: bytes) -> dict:
    try:
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="File is not a valid image.")

    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)

    preds = MODEL.predict(arr, verbose=0)[0]
    top3_idx = np.argsort(preds)[::-1][:3]

    return {
        "disease": CLASS_NAMES[top3_idx[0]],
        "confidence": float(preds[top3_idx[0]]),
        "top3": [
            {"disease": CLASS_NAMES[i], "confidence": float(preds[i])}
            for i in top3_idx
        ],
    }


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "Plant Disease Classifier API is running."}


@app.get("/health")
def health():
    return {
        "model_loaded": MODEL is not None,
        "num_classes": len(CLASS_NAMES) if CLASS_NAMES else 0,
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if MODEL is None or CLASS_NAMES is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet.")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. "
                   f"Allowed types: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    image_bytes = await file.read()

    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_mb:.1f} MB). Max is {MAX_FILE_SIZE_MB} MB.",
        )

    try:
        result = run_prediction(image_bytes)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)