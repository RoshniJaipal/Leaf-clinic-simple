export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-canopy-800/8 dark:bg-canopy-50/10 ${className}`} />;
}

export function ResultSkeleton() {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <SkeletonBlock className="mb-3 h-4 w-24" />
        <SkeletonBlock className="mb-2 h-8 w-56" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <div className="card p-5">
        <SkeletonBlock className="mb-3 h-3 w-20" />
        <SkeletonBlock className="h-3 w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card p-5">
            <SkeletonBlock className="mb-3 h-4 w-28" />
            <SkeletonBlock className="mb-2 h-3 w-full" />
            <SkeletonBlock className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
