import { useEffect, useMemo, useState } from "react";
import { fetchLaunchHistory } from "./HistoryService";
import { LaunchHistory } from "./HistoryTypes";
import { HistoryTimeline } from "./HistoryTimeline";
import { HistorySummaryCard } from "./HistorySummary";
import { HistorySearch } from "../../components/history/HistorySearch";
import { HistorySkeleton } from "../../components/history/HistorySkeleton";
import { HistoryError } from "../../components/history/HistoryError";
import { EmptyHistoryState } from "../../components/history/EmptyHistoryState";

interface HistoryPageProps {
  setCurrentView: (view: string) => void;
  onSelectAnalysis: (id: string) => void;
}

const RECENT_LAUNCHES_LIMIT = 8;
const RECENT_RECOMMENDATIONS_LIMIT = 5;
const SCORE_TREND_WINDOW = 12;

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

export function HistoryPage({ setCurrentView, onSelectAnalysis }: HistoryPageProps) {
  const [history, setHistory] = useState<LaunchHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadHistory = () => {
    setIsLoading(true);
    setError(null);
    fetchLaunchHistory()
      .then(setHistory)
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to load launch history.";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredItems = useMemo(() => {
    if (!history) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return history.items;
    return history.items.filter((item) => item.productName.toLowerCase().includes(term));
  }, [history, searchTerm]);

  const recentLaunches = filteredItems.slice(0, RECENT_LAUNCHES_LIMIT);

  // Chronological (oldest-first) slice of scores for the trend bars.
  const recentScores = useMemo(() => {
    if (!history) return [];
    return [...history.items]
      .slice(0, SCORE_TREND_WINDOW)
      .reverse()
      .map((item) => item.launchReadiness);
  }, [history]);

  const recentRecommendations = history?.items.slice(0, RECENT_RECOMMENDATIONS_LIMIT) ?? [];

  const goToNewAnalysis = () => setCurrentView("new-analysis");
  const goToDashboard = () => setCurrentView("dashboard");

  return (
    <div className="animate-in fade-in duration-500 pb-12 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Launch History</h2>
        <p className="text-muted-foreground">
          Revisit previous PRD analyses and launch decisions without re-running Gemini.
        </p>
      </div>

      {isLoading && <HistorySkeleton />}

      {!isLoading && error && (
        <HistoryError message={error} onRetry={loadHistory} onReturnToDashboard={goToDashboard} />
      )}

      {!isLoading && !error && history && history.items.length === 0 && (
        <EmptyHistoryState onCreateFirst={goToNewAnalysis} />
      )}

      {!isLoading && !error && history && history.items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Recent Launches</h3>
                <HistorySearch value={searchTerm} onChange={setSearchTerm} />
              </div>
              {recentLaunches.length > 0 ? (
                <HistoryTimeline items={recentLaunches} onSelect={onSelectAnalysis} />
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No launches match "{searchTerm}".
                </p>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Recommendations</h3>
              {recentRecommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recommendations recorded yet.</p>
              ) : (
                <ul className="space-y-4">
                  {recentRecommendations.map((item) => (
                    <li key={item.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-sm font-medium text-foreground truncate">{item.productName}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(item.analysisDate)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <HistorySummaryCard summary={history.summary} statistics={history.statistics} recentScores={recentScores} />
          </div>
        </div>
      )}
    </div>
  );
}

// TODO: Report Sharing — allow sharing a saved analysis via a shareable link.
// TODO: PDF Export — export a saved analysis as a PDF from this list.
// TODO: Slack Notifications — notify a channel when a new analysis is saved.
