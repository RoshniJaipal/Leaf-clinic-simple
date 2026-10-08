import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2, RotateCcw } from "lucide-react";
import UploadZone from "../components/UploadZone.jsx";
import ResultPanel from "../components/ResultPanel.jsx";
import SeverityGauge from "../components/SeverityGauge.jsx";
import DiseaseInfoTabs from "../components/DiseaseInfoTabs.jsx";
import TreatmentSection from "../components/TreatmentSection.jsx";
import { ResultSkeleton } from "../components/Skeleton.jsx";
import { predictDisease } from "../api/client.js";
import { diseaseLabel } from "../lib/format.js";

export default function Predict() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelected = (f) => {
    setFile(f);
    setResult(null);
    setError(null);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    try {
      const data = await predictDisease(file, setProgress);
      setResult(data);
      toast.success(`Diagnosis complete: ${diseaseLabel(data.disease)}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="eyebrow mb-2">Diagnose</p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Upload a leaf photo</h1>
        <p className="mt-2 max-w-xl text-sm text-ink/60 dark:text-canopy-100/60">
          Clear, well-lit shots of a single leaf work best. We'll return a diagnosis, severity
          estimate, and a treatment plan.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <UploadZone
            onFileSelected={handleFileSelected}
            previewUrl={previewUrl}
            onClear={handleClear}
            disabled={loading}
          />

          {file && (
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handlePredict} disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Analyzing {progress > 0 ? `${progress}%` : ""}
                  </>
                ) : (
                  "Run diagnosis"
                )}
              </button>
              {!loading && (
                <button onClick={handleClear} className="btn-secondary">
                  <RotateCcw size={14} /> Start over
                </button>
              )}
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-rust-500/30 bg-rust-500/5 px-4 py-3 text-sm text-rust-500"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div>
          {loading && <ResultSkeleton />}
          {!loading && result && <ResultPanel result={result} imageUrl={previewUrl} />}
          {!loading && !result && !error && (
            <div className="card flex h-full min-h-[280px] items-center justify-center p-8 text-center">
              <p className="max-w-xs text-sm text-ink/40 dark:text-canopy-100/40">
                Your diagnosis, confidence score, and alternative predictions will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {!loading && result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10 space-y-8"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
            <SeverityGauge
              level={result.severity?.level}
              percentAffected={result.severity?.percent_affected ?? 0}
            />
            <div>
              <p className="eyebrow mb-3">Disease reference</p>
              <DiseaseInfoTabs info={result.info} />
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3">Treatment recommendations</p>
            <TreatmentSection treatments={result.info?.treatments} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
