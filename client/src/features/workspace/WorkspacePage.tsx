import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchWorkspace, fetchLaunchDashboard, buildLaunchTimeline } from "./WorkspaceService";
import { Launch, Workspace } from "./WorkspaceTypes";
import { ExecutiveDashboardViewModel } from "../../services/DashboardService";
import { WorkspaceCard } from "./WorkspaceCard";
import { LaunchSwitcher } from "./LaunchSwitcher";
import { TimelinePanel } from "./TimelinePanel";
import { HistorySkeleton } from "../../components/history/HistorySkeleton";
import { HistoryError } from "../../components/history/HistoryError";
import { EmptyHistoryState } from "../../components/history/EmptyHistoryState";

interface WorkspacePageProps {
  setCurrentView: (view: string) => void;
}

type LoadState = "loading" | "loaded" | "error";

const RECENT_LAUNCHES_LIMIT = 6;

const decisionBadgeClasses: Record<Launch["decision"], string> = {
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

export function WorkspacePage({ setCurrentView }: WorkspacePageProps) {
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [selectedLaunchId, setSelectedLaunchId] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<ExecutiveDashboardViewModel | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const loadWorkspace = useCallback(async () => {
    setState("loading");
    setErrorMessage(null);
    try {
      const snapshot = await fetchWorkspace();
      setWorkspace(snapshot.workspace);
      setLaunches(snapshot.launches);
      setSelectedLaunchId(snapshot.launches[0]?.launchId ?? null);
      setState("loaded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load workspace.";
      setErrorMessage(message);
      setState("error");
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  // Changing the selected launch only updates local view state below — it
  // never re-runs an analysis or calls Gemini. It reads the same saved
  // record via the existing Context Engine / Dashboard Service pipeline.
  useEffect(() => {
    if (!selectedLaunchId) {
      setDashboard(null);
      return;
    }

    let cancelled = false;
    setIsDashboardLoading(true);

    fetchLaunchDashboard(selectedLaunchId)
      .then((viewModel) => {
        if (!cancelled) setDashboard(viewModel);
      })
      .catch(() => {
        if (!cancelled) setDashboard(null);
      })
      .finally(() => {
        if (!cancelled) setIsDashboardLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLaunchId]);

  const selectedLaunch = useMemo(
    () => launches.find((launch) => launch.launchId === selectedLaunchId) ?? null,
    [launches, selectedLaunchId]
  );

  const timelineEvents = useMemo(() => {
    if (!selectedLaunch || !dashboard) return [];
    return buildLaunchTimeline(selectedLaunch, dashboard.integrationStatus);
  }, [selectedLaunch, dashboard]);

  const recentLaunches = launches.slice(0, RECENT_LAUNCHES_LIMIT);

  const goToNewAnalysis = () => setCurrentView("new-analysis");
  const goToDashboard = () => setCurrentView("dashboard");

  if (state === "loading") {
    return <HistorySkeleton />;
  }

  if (state === "error") {
    return (
      <HistoryError
        message={errorMessage ?? "Something went wrong."}
        onRetry={loadWorkspace}
        onReturnToDashboard={goToDashboard}
      />
    );
  }

  if (!workspace || launches.length === 0) {
    return <EmptyHistoryState onCreateFirst={goToNewAnalysis} />;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-12 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Workspace</h2>
        <p className="text-muted-foreground">
          Manage every launch analyzed in this project from a single view. Switching launches only changes
          what you're viewing — it never re-runs an analysis.
        </p>
      </div>

      <WorkspaceCard workspace={workspace} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Launch Switcher</h3>
            <LaunchSwitcher launches={launches} selectedLaunchId={selectedLaunchId} onSelect={setSelectedLaunchId} />
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Current Selected Launch</h3>
            {isDashboardLoading && <p className="text-sm text-muted-foreground">Loading launch overview…</p>}
            {!isDashboardLoading && dashboard && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Readiness</p>
                  <p className="text-xl font-bold text-foreground">{dashboard.launchReadiness.score}/100</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Decision</p>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${decisionBadgeClasses[dashboard.decision.decision]}`}
                  >
                    {dashboard.decision.decision}
                  </span>
                </div>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Risk</p>
                  <p className="text-xl font-bold text-foreground">{dashboard.risk.overallRisk}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="text-xl font-bold text-foreground">{dashboard.confidence.score}%</p>
                </div>
              </div>
            )}
            {!isDashboardLoading && !dashboard && (
              <p className="text-sm text-muted-foreground">Select a launch to preview its readiness overview.</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Launches</h3>
            <div className="space-y-2">
              {recentLaunches.map((launch) => (
                <button
                  key={launch.launchId}
                  onClick={() => setSelectedLaunchId(launch.launchId)}
                  className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-colors ${
                    launch.launchId === selectedLaunchId
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{launch.productName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(launch.analysisDate)}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border ${decisionBadgeClasses[launch.decision]}`}
                  >
                    {launch.decision}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Timeline</h3>
          <TimelinePanel events={timelineEvents} />
        </div>
      </div>
    </div>
  );
}
