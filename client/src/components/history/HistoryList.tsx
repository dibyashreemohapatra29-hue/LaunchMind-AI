import React from "react";
import { HistorySummary } from "../../lib/historyApi";
import { HistoryCard } from "./HistoryCard";

interface HistoryListProps {
  items: HistorySummary[];
  onSelect: (id: string) => void;
}

export function HistoryList({ items, onSelect }: HistoryListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <HistoryCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
