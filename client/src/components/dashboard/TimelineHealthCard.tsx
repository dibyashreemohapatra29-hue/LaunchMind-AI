import { Icons } from "../icons";
import { TimelineHealthViewModel } from "../../services/DashboardService";

const healthBadgeClasses: Record<TimelineHealthViewModel["health"], string> = {
  Fresh: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Aging: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Stale: "bg-destructive/10 text-destructive border-destructive/20",
};

export function TimelineHealthCard({ health, message, analysisAgeHours, staleDataWarning }: TimelineHealthViewModel) {
  return (
    <section className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Timeline Health
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Tracks freshness of launch data and analysis confidence.
          </p>
        </div>
        <div className={`p-2 rounded-md ${staleDataWarning ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
          <Icons.calendar className="w-4 h-4" />
        </div>
      </div>
      <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${healthBadgeClasses[health]}`}>
        {health}
      </span>
      <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
        {message}
        {analysisAgeHours !== null && ` (${Math.round(analysisAgeHours)}h since last analysis)`}
      </p>
    </section>
  );
}
