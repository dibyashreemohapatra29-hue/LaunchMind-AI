import React, { useCallback, useEffect, useState } from "react";
import { getLaunchContext } from "../services/ContextEngine";
import { buildLaunchIntelligence } from "../services/IntelligenceEngine";
import { buildDashboardViewModel, ExecutiveDashboardViewModel } from "../services/DashboardService";
import { ExecutiveDashboardSkeleton } from "../components/dashboard/ExecutiveDashboardSkeleton";
import { ExecutiveDashboardEmpty } from "../components/dashboard/ExecutiveDashboardEmpty";
import { ExecutiveDashboardError } from "../components/dashboard/ExecutiveDashboardError";
import { LaunchReadinessCard } from "../components/dashboard/LaunchReadinessCard";
import { TimelineHealthCard } from "../components/dashboard/TimelineHealthCard";
import { RiskSummaryCard } from "../components/dashboard/RiskSummaryCard";
import { ConfidenceCard } from "../components/dashboard/ConfidenceCard";
import { RecommendationCard } from "../components/dashboard/RecommendationCard";
import { PriorityActionsCard } from "../components/dashboard/PriorityActionsCard";
import { IntegrationStatusCard } from "../components/dashboard/IntegrationStatusCard";
import { RecentAnalysisSummaryCard } from "../components/dashboard/RecentAnalysisSummaryCard";

interface ExecutiveDashboardProps {
  setCurrentView: (view: string) => void;
}

type LoadState = "loading" | "loaded" | "error";

export function ExecutiveDashboard({ setCurrentView }: ExecutiveDashboardProps) {
  const [state, setState] = useState<LoadState>("loading");
  const [viewModel, setViewModel] = useState<ExecutiveDashboardViewModel | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setState("loading");
    setErrorMessage(null);

    try {
      const context = await getLaunchContext({ forceRefresh: true });
      const intelligence = buildLaunchIntelligence(context);
      setViewModel(buildDashboardViewModel(context, intelligence));
      setState("loaded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load the Executive Dashboard. Please try again.";
      setErrorMessage(message);
      setState("error");
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (state === "loading") {
    return <ExecutiveDashboardSkeleton />;
  }

  if (state === "error") {
    return (
      <ExecutiveDashboardError
        message={errorMessage ?? "Something went wrong."}
        onRetry={loadDashboard}
        onReturnToDashboard={() => setCurrentView("dashboard")}
      />
    );
  }

  if (!viewModel || !viewModel.hasAnalysis) {
    return <ExecutiveDashboardEmpty onCreateAnalysis={() => setCurrentView("new-analysis")} />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-12">
      <LaunchReadinessCard {...viewModel.launchReadiness} decision={viewModel.decision.decision} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TimelineHealthCard {...viewModel.timeline} />
        <ConfidenceCard {...viewModel.confidence} />
        <RiskSummaryCard {...viewModel.risk} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecommendationCard {...viewModel.recommendation} />
          <PriorityActionsCard {...viewModel.priorityActions} />
        </div>
        <div className="space-y-6">
          <RecentAnalysisSummaryCard {...viewModel.recentAnalysis} />
          <IntegrationStatusCard {...viewModel.integrationStatus} />
        </div>
      </div>
    </div>
  );
}
