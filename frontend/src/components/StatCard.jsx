import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon, accent = "canopy", suffix = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center gap-4 p-5"
    >
      <span
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
          accent === "canopy"
            ? "bg-canopy-500/10 text-canopy-600 dark:text-canopy-300"
            : accent === "amber"
            ? "bg-amber-500/10 text-amber-500"
            : "bg-rust-500/10 text-rust-500"
        }`}
      >
        {Icon && <Icon size={20} />}
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-canopy-100/50">
          {label}
        </p>
        <p className="font-display text-2xl font-semibold">
          {value}
          {suffix}
        </p>
      </div>
    </motion.div>
  );
}
