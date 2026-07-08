import React from "react";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function ExecutiveDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <SkeletonBlock className="h-4 w-48 mb-6" />
        <SkeletonBlock className="h-12 w-32 mb-4" />
        <SkeletonBlock className="h-2.5 w-full" />
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <section key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-6 w-20" />
            <SkeletonBlock className="h-3 w-full" />
          </section>
        ))}
      </div>

      <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
        <SkeletonBlock className="h-4 w-56 mb-3" />
        <SkeletonBlock className="h-3.5 w-full" />
        <SkeletonBlock className="h-3.5 w-11/12" />
        <SkeletonBlock className="h-3.5 w-3/4" />
      </section>
    </div>
  );
}
