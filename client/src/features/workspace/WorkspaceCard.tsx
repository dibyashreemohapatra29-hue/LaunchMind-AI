import { Workspace } from "./WorkspaceTypes";

const healthClasses: Record<Workspace["overallHealth"], string> = {
  Healthy: "bg-emerald-500/10 text-emerald-600",
  "At Risk": "bg-amber-500/10 text-amber-600",
  Critical: "bg-destructive/10 text-destructive",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">{workspace.name}</h2>
          <p className="text-sm text-muted-foreground">Logical grouping of every launch analyzed so far</p>
        </div>
        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${healthClasses[workspace.overallHealth]}`}>
          {workspace.overallHealth}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-muted/40 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Launch Count</p>
          <p className="text-xl font-bold text-foreground">{workspace.totalLaunches}</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Average Readiness</p>
          <p className="text-xl font-bold text-foreground">{workspace.averageReadiness}/100</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-4 col-span-2 sm:col-span-2">
          <p className="text-xs text-muted-foreground mb-1">Latest Launch</p>
          <p className="text-xl font-bold text-foreground">{formatDate(workspace.latestLaunch)}</p>
        </div>
      </div>
    </div>
  );
}
