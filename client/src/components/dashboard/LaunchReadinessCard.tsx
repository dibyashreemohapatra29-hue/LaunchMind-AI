import { LaunchReadinessViewModel, DecisionViewModel } from "../../services/DashboardService";
import { DecisionBadge } from "./DecisionBadge";

const levelBadgeClasses: Record<LaunchReadinessViewModel["level"], string> = {
  Strong: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Moderate: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Weak: "bg-destructive/10 text-destructive border-destructive/20",
};

const progressBarClasses: Record<LaunchReadinessViewModel["level"], string> = {
  Strong: "bg-emerald-500",
  Moderate: "bg-amber-500",
  Weak: "bg-destructive",
};

interface LaunchReadinessCardProps extends LaunchReadinessViewModel {
  decision?: DecisionViewModel["decision"];
}

export function LaunchReadinessCard({ score, level, decision }: LaunchReadinessCardProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Launch Readiness Score
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            AI-generated assessment based on risks, requirements, and launch signals.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {decision && <DecisionBadge decision={decision} />}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelBadgeClasses[level]}`}>
            {level}
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-5xl font-bold text-foreground">{clampedScore}</span>
        <span className="text-lg text-muted-foreground mb-1">/100</span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${progressBarClasses[level]}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </section>
  );
}
