import { Leaf, ScanLine, ShieldCheck, Github } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">About</p>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">How Leaf Clinic works</h1>
      <p className="mt-4 text-ink/60 dark:text-canopy-100/60">
        Leaf Clinic pairs a convolutional neural network with a reference library of crop
        diseases to turn a single leaf photo into a diagnosis, a severity estimate, and a
        treatment plan.
      </p>

      <div className="mt-10 space-y-8">
        <div className="flex gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-canopy-500/10 text-canopy-600 dark:text-canopy-300">
            <ScanLine size={18} />
          </span>
          <div>
            <h3 className="font-semibold">The model</h3>
            <p className="mt-1 text-sm text-ink/60 dark:text-canopy-100/60">
              Predictions come from a trained image classifier served by a FastAPI backend. The
              current build runs on a stub while the production model is finalized — the API
              contract stays identical once it's swapped in.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-canopy-500/10 text-canopy-600 dark:text-canopy-300">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h3 className="font-semibold">A diagnostic aid, not a verdict</h3>
            <p className="mt-1 text-sm text-ink/60 dark:text-canopy-100/60">
              Treat every result as a starting point. For severe, fast-spreading, or unusual
              cases, confirm with a local agronomist or extension office before treating.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-canopy-500/10 text-canopy-600 dark:text-canopy-300">
            <Leaf size={18} />
          </span>
          <div>
            <h3 className="font-semibold">Currently supported</h3>
            <p className="mt-1 text-sm text-ink/60 dark:text-canopy-100/60">
              Early blight, late blight, leaf mold, and healthy classification for tomato and
              related solanaceous crops, with more disease classes on the way.
            </p>
          </div>
        </div>
      </div>

      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-canopy-600 hover:underline dark:text-canopy-300"
      >
        <Github size={15} /> View the source
      </a>
    </div>
  );
}
