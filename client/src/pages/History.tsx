import React, { useEffect, useMemo, useState } from "react";
import { fetchAnalysisHistory, HistorySummary } from "../lib/historyApi";
import { HistorySearch } from "../components/history/HistorySearch";
import { HistoryList } from "../components/history/HistoryList";
import { HistorySkeleton } from "../components/history/HistorySkeleton";
import { HistoryError } from "../components/history/HistoryError";
import { EmptyHistoryState } from "../components/history/EmptyHistoryState";

interface HistoryProps {
  setCurrentView: (view: string) => void;
  onSelectAnalysis: (id: string) => void;
}

export function History({ setCurrentView, onSelectAnalysis }: HistoryProps) {
  const [items, setItems] = useState<HistorySummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadHistory = () => {
    setIsLoading(true);
    setError(null);
    fetchAnalysisHistory()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to load analysis history.";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.productName.toLowerCase().includes(term));
  }, [items, searchTerm]);

  const goToNewAnalysis = () => setCurrentView("new-analysis");
  const goToDashboard = () => setCurrentView("dashboard");

  return (
    <div className="animate-in fade-in duration-500 pb-12 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Analysis History</h2>
        <p className="text-muted-foreground">
          Revisit previous PRD analyses and launch decisions without re-running Gemini.
        </p>
      </div>

      {isLoading && <HistorySkeleton />}

      {!isLoading && error && (
        <HistoryError message={error} onRetry={loadHistory} onReturnToDashboard={goToDashboard} />
      )}

      {!isLoading && !error && items && items.length === 0 && (
        <EmptyHistoryState onCreateFirst={goToNewAnalysis} />
      )}

      {!isLoading && !error && items && items.length > 0 && (
        <>
          <HistorySearch value={searchTerm} onChange={setSearchTerm} />
          {filteredItems.length > 0 ? (
            <HistoryList items={filteredItems} onSelect={onSelectAnalysis} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No analyses match "{searchTerm}".
            </p>
          )}
        </>
      )}
    </div>
  );
}

// TODO: Report Sharing — allow sharing a saved analysis via a shareable link.
// TODO: PDF Export — export a saved analysis as a PDF from this list.
// TODO: Slack Notifications — notify a channel when a new analysis is saved.
