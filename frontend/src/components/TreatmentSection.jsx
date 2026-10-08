import { Sprout, FlaskConical, ShieldPlus } from "lucide-react";

const GROUPS = [
  {
    key: "organic",
    label: "Organic Treatment",
    icon: Sprout,
    accent: "text-canopy-600 dark:text-canopy-300",
    ring: "border-canopy-500/20 bg-canopy-500/5",
  },
  {
    key: "chemical",
    label: "Chemical Treatment",
    icon: FlaskConical,
    accent: "text-amber-500",
    ring: "border-amber-500/20 bg-amber-500/5",
  },
  {
    key: "preventive",
    label: "Preventive Measures",
    icon: ShieldPlus,
    accent: "text-clay-500",
    ring: "border-clay-500/30 bg-clay-500/5",
  },
];

export default function TreatmentSection({ treatments }) {
  if (!treatments) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {GROUPS.map(({ key, label, icon: Icon, accent, ring }) => {
        const items = treatments[key];
        if (!items?.length) return null;
        return (
          <div key={key} className={`card border p-5 ${ring}`}>
            <div className="mb-3 flex items-center gap-2">
              <Icon size={17} className={accent} />
              <h4 className="text-sm font-semibold">{label}</h4>
            </div>
            <ul className="space-y-2.5">
              {items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink/70 dark:text-canopy-100/70">
                  <span className={`mt-1.5 h-1 w-1 flex-shrink-0 rounded-full ${accent.replace("text-", "bg-")}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
