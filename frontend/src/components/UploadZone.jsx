import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Camera, ImageOff, X } from "lucide-react";
import toast from "react-hot-toast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

export default function UploadZone({ onFileSelected, previewUrl, onClear, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const validateAndEmit = useCallback(
    (file) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error("Please upload a JPG, PNG, or WEBP image.");
        return;
      }
      if (file.size > MAX_BYTES) {
        toast.error("Image is too large — max 8MB.");
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      validateAndEmit(file);
    },
    [validateAndEmit]
  );

  if (previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-canopy-800/10 bg-white shadow-soft dark:border-canopy-50/10 dark:bg-canopy-900">
        <img src={previewUrl} alt="Leaf preview" className="aspect-video w-full object-cover" />
        {!disabled && (
          <button
            onClick={onClear}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        animate={{
          borderColor: dragActive ? "rgba(72,134,90,0.8)" : "rgba(31,61,42,0.18)",
          scale: dragActive ? 1.01 : 1,
        }}
        className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-white/60 px-6 text-center transition dark:border-canopy-50/15 dark:bg-canopy-900/40"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canopy-800/8 text-canopy-700 dark:bg-canopy-50/10 dark:text-canopy-200">
          <UploadCloud size={26} />
        </span>
        <div>
          <p className="font-medium">
            <span className="text-canopy-700 dark:text-canopy-300">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-ink/50 dark:text-canopy-100/50">JPG, PNG or WEBP — up to 8MB</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cameraInputRef.current?.click();
          }}
          className="btn-secondary mt-1 !py-1.5 !px-3 text-xs"
        >
          <Camera size={14} /> Use camera
        </button>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />
    </div>
  );
}

export function EmptyImageState() {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center text-ink/40 dark:text-canopy-100/40">
      <ImageOff size={28} />
      <p className="text-sm">No image selected yet</p>
    </div>
  );
}
