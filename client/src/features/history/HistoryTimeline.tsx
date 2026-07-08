import React from "react";
import { HistoryItem } from "./HistoryTypes";
import { HistoryCard } from "./HistoryCard";

const decisionDotClasses: Record<HistoryItem["decision"], string> = {
  GO: "bg-emerald-500",
  "GO WITH RISKS": "bg-amber-500",
  "NO-GO": "bg-destructive",
};

interface HistoryTimelineProps {
  items: HistoryItem[];
  onSelect: (id: string) => void;
}

export function HistoryTimeline({ items, onSelect }: HistoryTimelineProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">No launches to display.</p>
    );
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <span
              className={`absolute -left-6 top-2 w-3.5 h-3.5 rounded-full border-2 border-background ${decisionDotClasses[item.decision]}`}
              aria-hidden="true"
            />
            <HistoryCard item={item} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}
