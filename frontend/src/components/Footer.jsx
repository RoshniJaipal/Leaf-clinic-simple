import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-canopy-800/10 py-10 dark:border-canopy-50/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Leaf size={16} className="text-canopy-600 dark:text-canopy-300" />
          Leaf Clinic
        </span>
        <p className="max-w-md text-xs text-ink/50 dark:text-canopy-100/50">
          A diagnostic aid, not a replacement for an agronomist. Confirm severe
          or spreading cases with a local extension office before treating.
        </p>
      </div>
    </footer>
  );
}
