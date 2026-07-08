import { Icons } from "../icons";
import { RiskSummaryViewModel } from "../../services/DashboardService";

const riskBadgeClasses: Record<RiskSummaryViewModel["overallRisk"], string> = {
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  High: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RiskSummaryCard({ overallRisk, criticalCount, mediumCount, lowCount, summary }: RiskSummaryViewModel) {
  return (
    <section className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-muted-foreground">Overall Risk</span>
        <div className={`p-2 rounded-md ${overallRisk === "High" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
          <Icons.alertTriangle className="w-4 h-4" />
        </div>
      </div>
      <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${riskBadgeClasses[overallRisk]}`}>
        {overallRisk} Risk
      </span>
      <div className="flex gap-3 text-xs text-muted-foreground mb-2">
        <span>{criticalCount} Critical</span>
        <span>{mediumCount} Medium</span>
        <span>{lowCount} Low</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mt-auto">{summary}</p>
    </section>
  );
}
