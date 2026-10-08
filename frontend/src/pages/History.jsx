import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Search, Trash2, Download, Inbox } from "lucide-react";
import { fetchHistory, deleteHistoryEntry } from "../api/client.js";
import { diseaseLabel, formatConfidence, formatTimestamp, severityMeta } from "../lib/format.js";
import { SkeletonBlock } from "../components/Skeleton.jsx";

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("all");
  const [err, setErr] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory(100);
      setEntries(data);
      setErr(null);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const diseaseOptions = useMemo(() => {
    const set = new Set(entries.map((e) => e.disease));
    return ["all", ...Array.from(set)];
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesQuery =
        !query ||
        diseaseLabel(e.disease).toLowerCase().includes(query.toLowerCase()) ||
        e.filename?.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = diseaseFilter === "all" || e.disease === diseaseFilter;
      return matchesQuery && matchesFilter;
    });
  }, [entries, query, diseaseFilter]);

  const handleDelete = async (id) => {
    const prev = entries;
    setEntries((e) => e.filter((x) => x.id !== id));
    try {
      await deleteHistoryEntry(id);
      toast.success("Entry deleted");
    } catch (e) {
      setEntries(prev);
      toast.error(e.message);
    }
  };

  const handleDownload = () => {
    const rows = [
      ["Date", "Filename", "Disease", "Confidence", "Severity", "Percent Affected"],
      ...filtered.map((e) => [
        formatTimestamp(e.timestamp),
        e.filename,
        diseaseLabel(e.disease),
        formatConfidence(e.confidence),
        severityMeta[e.severity_level]?.label ?? e.severity_level,
        `${e.percent_affected ?? 0}%`,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaf-clinic-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Records</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Scan history</h1>
        </div>
        <button onClick={handleDownload} disabled={!filtered.length} className="btn-secondary">
          <Download size={14} /> Download report
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 dark:text-canopy-100/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by disease or filename…"
            className="w-full rounded-full border border-canopy-800/15 bg-white/70 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-canopy-500 dark:border-canopy-50/15 dark:bg-canopy-900/50"
          />
        </div>
        <select
          value={diseaseFilter}
          onChange={(e) => setDiseaseFilter(e.target.value)}
          className="rounded-full border border-canopy-800/15 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-canopy-500 dark:border-canopy-50/15 dark:bg-canopy-900/50"
        >
          {diseaseOptions.map((d) => (
            <option key={d} value={d}>
              {d === "all" ? "All diseases" : diseaseLabel(d)}
            </option>
          ))}
        </select>
      </div>

      {err && (
        <p className="mb-6 rounded-xl border border-rust-500/30 bg-rust-500/5 px-4 py-3 text-sm text-rust-500">
          {err}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-16 text-center">
          <Inbox size={28} className="text-ink/30 dark:text-canopy-100/30" />
          <p className="text-sm text-ink/50 dark:text-canopy-100/50">
            {entries.length === 0 ? "No scans yet." : "No entries match your search."}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 border-b border-canopy-800/8 px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink/40 sm:grid dark:border-canopy-50/10 dark:text-canopy-100/40">
            <span>Date</span>
            <span>Disease</span>
            <span>Confidence</span>
            <span>Severity</span>
            <span></span>
            <span></span>
          </div>
          <AnimatePresence initial={false}>
            {filtered.map((e) => {
              const sev = severityMeta[e.severity_level] || severityMeta.none;
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 items-center gap-3 border-b border-canopy-800/8 px-5 py-4 text-sm last:border-0 sm:grid-cols-[1fr_1fr_auto_auto_auto_auto] dark:border-canopy-50/10"
                >
                  <span className="text-ink/60 dark:text-canopy-100/60">{formatTimestamp(e.timestamp)}</span>
                  <span className="font-medium">{diseaseLabel(e.disease)}</span>
                  <span className="font-mono text-xs text-ink/50 dark:text-canopy-100/50">
                    {formatConfidence(e.confidence)}
                  </span>
                  <span className="pill w-fit bg-canopy-800/5 text-xs dark:bg-canopy-50/10">{sev.label}</span>
                  <img
                    src={e.image_url}
                    alt=""
                    className="hidden h-9 w-9 rounded-lg object-cover sm:block"
                    onError={(ev) => (ev.target.style.display = "none")}
                  />
                  <button
                    onClick={() => handleDelete(e.id)}
                    aria-label="Delete entry"
                    className="justify-self-end rounded-full p-2 text-ink/40 transition hover:bg-rust-500/10 hover:text-rust-500 dark:text-canopy-100/40"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
