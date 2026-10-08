import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ScanLine, Leaf, AlertTriangle, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard.jsx";
import { SkeletonBlock } from "../components/Skeleton.jsx";
import { fetchStats, fetchHistory } from "../api/client.js";
import { diseaseLabel, formatTimestamp } from "../lib/format.js";

const PIE_COLORS = ["#48865a", "#c1443c", "#d9a441", "#93c29e", "#c68a48"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsData, historyData] = await Promise.all([fetchStats(), fetchHistory(6)]);
        if (!cancelled) {
          setStats(statsData);
          setRecent(historyData);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const barData = (stats?.by_disease || []).map((d) => ({
    name: diseaseLabel(d.disease),
    count: d.count,
  }));

  const pieData = (stats?.by_disease || []).map((d) => ({
    name: diseaseLabel(d.disease),
    value: d.count,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Overview</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Dashboard</h1>
        </div>
        <Link to="/predict" className="btn-primary">
          New diagnosis <ArrowRight size={16} />
        </Link>
      </div>

      {err && (
        <p className="mb-6 rounded-xl border border-rust-500/30 bg-rust-500/5 px-4 py-3 text-sm text-rust-500">
          {err}
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total scans" value={stats?.total_scans ?? 0} icon={ScanLine} />
          <StatCard label="Healthy leaves" value={stats?.healthy_count ?? 0} icon={Leaf} accent="canopy" />
          <StatCard label="Diseased leaves" value={stats?.diseased_count ?? 0} icon={AlertTriangle} accent="rust" />
          <StatCard
            label="Most common"
            value={stats?.most_common_disease ? diseaseLabel(stats.most_common_disease) : "—"}
            icon={Target}
            accent="amber"
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 lg:col-span-3"
        >
          <p className="mb-4 text-sm font-semibold">Predictions by disease</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }}
                  cursor={{ fill: "rgba(72,134,90,0.08)" }}
                />
                <Bar dataKey="count" fill="#48865a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card p-6 lg:col-span-2"
        >
          <p className="mb-4 text-sm font-semibold">Disease distribution</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mt-6 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">Recent activity</p>
          <Link to="/history" className="text-xs font-medium text-canopy-600 hover:underline dark:text-canopy-300">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/40 dark:text-canopy-100/40">
            No scans yet — run your first diagnosis to see activity here.
          </p>
        ) : (
          <div className="space-y-1">
            {recent.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-canopy-800/[0.03] dark:hover:bg-canopy-50/[0.03]"
              >
                <span className="font-medium">{diseaseLabel(r.disease)}</span>
                <span className="font-mono text-xs text-ink/50 dark:text-canopy-100/50">
                  {(r.confidence * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-ink/40 dark:text-canopy-100/40">
                  {formatTimestamp(r.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
