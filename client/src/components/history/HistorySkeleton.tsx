
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function HistorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-5 w-16 rounded-full" />
          </div>
          <SkeletonBlock className="h-3 w-1/3" />
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
