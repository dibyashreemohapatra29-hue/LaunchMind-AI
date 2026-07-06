import React from "react";
import { HistorySummary } from "../../lib/historyApi";
import { Decision } from "../../lib/resultsMapper";

const badgeClasses: Record<Decision, string> = {
  GO: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "GO WITH RISKS": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "NO-GO": "bg-destructive/10 text-destructive border-destructive/20",
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
  item: HistorySummary;
  onSelect: (id: string) => void;
}

export function HistoryCard({ item, onSelect }: HistoryCardProps) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      className="text-left bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-foreground leading-snug truncate">{item.productName}</h3>
        <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeClasses[item.recommendation]}`}>
          {item.recommendation}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-4 capitalize">{item.productType}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{formatDate(item.createdAt)}</span>
        <span className="font-semibold text-foreground">
          {item.readinessScore}
          <span className="text-muted-foreground font-normal">/100</span>
        </span>
      </div>
    </button>
  );
}
