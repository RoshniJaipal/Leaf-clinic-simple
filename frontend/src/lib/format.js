export function diseaseLabel(key) {
  if (!key) return "Unknown";
  return key
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export const severityMeta = {
  none: { label: "Healthy", color: "canopy", dot: "#48865a" },
  mild: { label: "Mild", color: "canopy", dot: "#67a476" },
  moderate: { label: "Moderate", color: "amber", dot: "#d9a441" },
  severe: { label: "Severe", color: "rust", dot: "#c1443c" },
};

export function formatConfidence(value) {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatTimestamp(unixSeconds) {
  if (!unixSeconds) return "—";
  return new Date(unixSeconds * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
