import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sprout, Stethoscope, Dna, Wind, Gauge, ShieldCheck } from "lucide-react";

const SECTIONS = [
  { key: "description", label: "Overview", icon: Sprout },
  { key: "symptoms", label: "Symptoms", icon: Stethoscope },
  { key: "cause", label: "Cause", icon: Dna },
  { key: "spread", label: "Spread", icon: Wind },
  { key: "crops_affected", label: "Crops Affected", icon: Gauge },
  { key: "prevention", label: "Prevention", icon: ShieldCheck },
];

function SectionBody({ value }) {
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2 text-sm text-ink/70 dark:text-canopy-100/70">
        {value.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-canopy-500" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-sm leading-relaxed text-ink/70 dark:text-canopy-100/70">{value}</p>;
}

export default function DiseaseInfoTabs({ info }) {
  const [openKey, setOpenKey] = useState("description");

  if (!info) return null;

  return (
    <div className="card divide-y divide-canopy-800/8 dark:divide-canopy-50/10">
      {SECTIONS.map(({ key, label, icon: Icon }) => {
        const value = info[key];
        if (!value) return null;
        const isOpen = openKey === key;
        return (
          <div key={key}>
            <button
              onClick={() => setOpenKey(isOpen ? null : key)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold">
                <Icon size={16} className="text-canopy-600 dark:text-canopy-300" />
                {label}
              </span>
              <ChevronDown
                size={16}
                className={`text-ink/40 transition-transform dark:text-canopy-100/40 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <SectionBody value={value} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
