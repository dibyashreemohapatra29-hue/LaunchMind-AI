import { DecisionViewModel } from "../../services/DashboardService";

const badgeClasses: Record<DecisionViewModel["decision"], string> = {
  GO: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "GO WITH RISKS": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "NO-GO": "bg-destructive/10 text-destructive border-destructive/20",
};

export function DecisionBadge({ decision }: DecisionViewModel) {
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${badgeClasses[decision]}`}>
      {decision}
    </span>
  );
}
