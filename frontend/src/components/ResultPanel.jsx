import { motion } from "framer-motion";
import { Clock, ScanEye } from "lucide-react";
import { diseaseLabel, formatConfidence, formatTimestamp } from "../lib/format.js";

export default function ResultPanel({ result, imageUrl }) {
  if (!result) return null;
  const { disease, confidence, top3, timestamp } = result;
  const isHealthy = disease === "healthy";

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow mb-1">{isHealthy ? "Diagnosis" : "Disease Detected"}</p>
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">
              {diseaseLabel(disease)}
            </h3>
          </div>
          <span
            className={`pill ${
              isHealthy
                ? "bg-canopy-500/10 text-canopy-700 dark:text-canopy-300"
                : "bg-rust-500/10 text-rust-500"
            }`}
          >
            {formatConfidence(confidence)} confidence
          </span>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-ink/45 dark:text-canopy-100/45">
          <Clock size={13} />
          Predicted {formatTimestamp(timestamp)}
        </div>

        {top3?.length > 1 && (
          <div className="mt-5 border-t border-canopy-800/8 pt-4 dark:border-canopy-50/10">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-canopy-100/50">
              Alternative predictions
            </p>
            <div className="space-y-2">
              {top3.slice(1).map((alt) => (
                <div key={alt.disease} className="flex items-center gap-3">
                  <span className="w-32 flex-shrink-0 truncate text-sm text-ink/70 dark:text-canopy-100/70">
                    {diseaseLabel(alt.disease)}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canopy-800/8 dark:bg-canopy-50/10">
                    <div
                      className="h-full rounded-full bg-canopy-400"
                      style={{ width: `${alt.confidence * 100}%` }}
                    />
                  </div>
                  <span className="w-12 flex-shrink-0 text-right font-mono text-xs text-ink/50 dark:text-canopy-100/50">
                    {(alt.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <ScanEye size={16} className="text-canopy-600 dark:text-canopy-300" />
            <p className="text-sm font-semibold">Explainable AI</p>
            <span className="pill bg-canopy-800/5 text-[10px] dark:bg-canopy-50/10">Preview</span>
          </div>
          <div className="relative overflow-hidden rounded-xl">
            <img src={imageUrl} alt="Leaf scan" className="aspect-video w-full object-cover opacity-90" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canopy-400/0 via-canopy-400/10 to-canopy-400/0">
              <div className="absolute left-0 right-0 h-16 animate-scanline bg-gradient-to-b from-transparent via-canopy-300/40 to-transparent" />
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink/50 dark:text-canopy-100/50">
            The highlighted regions will indicate the parts of the leaf that influenced the AI's
            prediction once Grad-CAM heatmap generation is wired up to the trained model.
          </p>
        </motion.div>
      )}
    </div>
  );
}
