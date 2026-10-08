# Leaf Clinic — Simple Version (No Model Required)

Same app as before — upload flow, disease info, severity, treatment
recommendations, dashboard, history — but `/predict` always returns a
**random** result from the 15 known disease classes. No TensorFlow, no
model file, no GPU/DLL setup. Just three lightweight Python packages.

This is the version to use if you want to demo the whole app right now
without dealing with model installation issues.

## Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows PowerShell
# source .venv/bin/activate       # macOS/Linux
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Runs on `http://127.0.0.1:8000`. Startup log should show:
```
Startup complete. 15 remedy entries, 15 disease info entries loaded.
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173/` and proxies API calls to the backend.
Keep both terminals running at the same time.

## Adding a real model later

`run_prediction()` in `backend/main.py` is clearly marked as a stub —
its docstring explains exactly what shape to return. When you're ready
to wire in a real trained model, that function is the only thing that
needs to change; everything else (disease info, treatment, severity,
history, dashboard) already expects real predictions and will work
unchanged.
