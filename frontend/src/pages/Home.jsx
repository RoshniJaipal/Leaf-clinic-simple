import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ScanLine, Sprout, CloudSun, History, Leaf } from "lucide-react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "Instant diagnosis",
    body: "Upload or snap a leaf photo and get a disease call with confidence in seconds.",
  },
  {
    icon: Sprout,
    title: "Treatment plans",
    body: "Organic, chemical, and preventive guidance tailored to the diagnosed disease.",
  },
  {
    icon: CloudSun,
    title: "Weather-aware risk",
    body: "Cross-reference humidity and rainfall to flag conditions ripe for fungal spread.",
  },
  {
    icon: History,
    title: "Scan history",
    body: "Every diagnosis is logged so you can track a field's health over the season.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow mb-4">Field diagnostics, in your pocket</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Know what's wrong
              <br />
              with your crop <span className="italic text-canopy-600 dark:text-canopy-300">before</span> it spreads.
            </h1>
            <p className="mt-6 max-w-md text-base text-ink/60 dark:text-canopy-100/60">
              Leaf Clinic reads a single photo of a leaf and returns a disease diagnosis,
              severity estimate, and a treatment plan — organic and chemical — in one pass.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/predict" className="btn-primary">
                Diagnose a leaf <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                View dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="card animate-floatSlow overflow-hidden p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-canopy-200 to-canopy-400 dark:from-canopy-800 dark:to-canopy-950">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf size={96} className="text-canopy-800/30 dark:text-canopy-50/20" strokeWidth={1} />
                </div>
                <div className="absolute left-0 right-0 h-20 animate-scanline bg-gradient-to-b from-transparent via-white/40 to-transparent" />
              </div>
              <div className="mt-3 flex items-center justify-between px-2 pb-1">
                <span className="pill bg-rust-500/10 text-rust-500">Early Blight</span>
                <span className="font-mono text-xs text-ink/50 dark:text-canopy-100/50">97.84%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-canopy-500/10 text-canopy-600 dark:text-canopy-300">
                <f.icon size={19} />
              </span>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm text-ink/60 dark:text-canopy-100/60">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
