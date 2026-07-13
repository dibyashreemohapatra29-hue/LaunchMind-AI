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
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Risk Summary
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            AI-classified launch risks based on the latest PRD analysis.
          </p>
        </div>
        <div className={`p-2 rounded-md ${overallRisk === "High" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
          <Icons.alertTriangle className="w-4 h-4" />
        </div>
      </div>
      <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${riskBadgeClasses[overallRisk]}`}>
        {overallRisk} Risk
      </span>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 rounded-full text-xs bg-destructive/10 text-destructive">
          {criticalCount} Critical
        </span>

        <span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-600">
          {mediumCount} Medium
        </span>

        <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-600">
          {lowCount} Low
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mt-auto">{summary}</p>
    </section>
  );
}
