import { Icons } from "../icons";
import { ConfidenceViewModel } from "../../services/DashboardService";

const levelBadgeClasses: Record<ConfidenceViewModel["level"], string> = {
  HIGH: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  LOW: "bg-destructive/10 text-destructive border-destructive/20",
};

export function ConfidenceCard({ score, level }: ConfidenceViewModel) {
  return (
    <section className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-muted-foreground">Confidence Level</span>
        <div className="p-2 rounded-md bg-muted text-muted-foreground">
          <Icons.checkCircle className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-auto">
        <span className="text-2xl font-bold text-foreground">{score}%</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelBadgeClasses[level]}`}>
          {level}
        </span>
      </div>
    </section>
  );
}
