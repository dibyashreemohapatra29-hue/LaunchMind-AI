
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-8">
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SkeletonBlock className="h-4 w-40 mb-6" />
        <SkeletonBlock className="h-12 w-32 mb-4" />
        <SkeletonBlock className="h-2.5 w-full" />
      </section>

      <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-40 mb-3" />
        <SkeletonBlock className="h-3.5 w-full" />
        <SkeletonBlock className="h-3.5 w-11/12" />
        <SkeletonBlock className="h-3.5 w-3/4" />
      </section>

      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SkeletonBlock className="h-4 w-56 mb-4" />
        <SkeletonBlock className="h-8 w-32 mb-4" />
        <SkeletonBlock className="h-3.5 w-2/3" />
      </section>

      <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-32 mb-3" />
        {[1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-10 w-full" />
        ))}
      </section>
    </div>
  );
}
