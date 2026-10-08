import { motion } from "framer-motion";
import { severityMeta } from "../lib/format.js";

const BAR_COLORS = {
  canopy: "bg-canopy-500",
  amber: "bg-amber-500",
  rust: "bg-rust-500",
};

const DOT = {
  none: "🟢",
  mild: "🟢",
  moderate: "🟡",
  severe: "🔴",
};

export default function SeverityGauge({ level = "none", percentAffected = 0 }) {
  const meta = severityMeta[level] || severityMeta.none;

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">Severity</p>
        <span className="pill bg-canopy-800/5 dark:bg-canopy-50/10">
          {DOT[level]} {meta.label}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-canopy-800/8 dark:bg-canopy-50/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentAffected}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`h-full rounded-full ${BAR_COLORS[meta.color]}`}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-ink/50 dark:text-canopy-100/50">
        <span>Estimated area affected</span>
        <span className="font-mono font-medium text-ink/80 dark:text-canopy-100/80">
          {percentAffected.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
