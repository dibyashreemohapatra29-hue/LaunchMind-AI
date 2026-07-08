import { Icons } from "../../components/icons";
import { HistoryItem } from "./HistoryTypes";

const decisionBadgeClasses: Record<HistoryItem["decision"], string> = {
  GO: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "GO WITH RISKS": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "NO-GO": "bg-destructive/10 text-destructive border-destructive/20",
};

const riskBadgeClasses: Record<HistoryItem["riskLevel"], string> = {
  Low: "bg-emerald-500/10 text-emerald-600",
  Medium: "bg-amber-500/10 text-amber-600",
  High: "bg-destructive/10 text-destructive",
};

function formatDate(iso: string): string {
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

interface HistoryCardProps {
  item: HistoryItem;
  onSelect: (id: string) => void;
}

export function HistoryCard({ item, onSelect }: HistoryCardProps) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      className="text-left w-full bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-foreground leading-snug truncate">{item.productName}</h3>
        <span
          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border ${decisionBadgeClasses[item.decision]}`}
        >
          {item.decision}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-4 capitalize">{item.productType}</p>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.recommendation}</p>

      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-muted-foreground">{formatDate(item.analysisDate)}</span>
        <span className="font-semibold text-foreground">
          {item.launchReadiness}
          <span className="text-muted-foreground font-normal">/100</span>
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskBadgeClasses[item.riskLevel]}`}>
          {item.riskLevel} Risk
        </span>
        <div className="flex items-center gap-2 text-muted-foreground">
          {item.slackShared && <Icons.slack className="w-3.5 h-3.5" />}
          {item.driveExported && <Icons.upload className="w-3.5 h-3.5" />}
        </div>
      </div>
    </button>
  );
}
