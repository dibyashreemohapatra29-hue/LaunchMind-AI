import React, { useMemo, useState } from "react";
import { AnalysisResult, sendToSlack, exportToDrive } from "../lib/api";
import { AnalysisConfig } from "../components/new-analysis/AnalysisOptions";
import { mapToResultsViewData, ResultsViewData } from "../lib/resultsMapper";
import { Icons } from "../components/icons";
import { ScoreCard } from "../components/results/ScoreCard";
import { ExecutiveSummary } from "../components/results/ExecutiveSummary";
import { RecommendationCard } from "../components/results/RecommendationCard";
import { RisksTable } from "../components/results/RisksTable";
import { MissingRequirements } from "../components/results/MissingRequirements";
import { AIRecommendations } from "../components/results/AIRecommendations";
import { SelectedOptions } from "../components/results/SelectedOptions";
import { ResultsActions } from "../components/results/ResultsActions";
import { ResultsSkeleton } from "../components/results/ResultsSkeleton";
import { ResultsError } from "../components/results/ResultsError";
import { DriveStatus } from "../components/results/GoogleDriveExportButton";
import { Toast } from "../components/ui/Toast";

type SlackStatus = "idle" | "loading" | "success" | "error";

interface ResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  selectedOptions: AnalysisConfig | null;
  setCurrentView: (view: string) => void;
  viewDataOverride?: ResultsViewData | null;
  backTarget?: "new-analysis" | "history";
  historyMeta?: { productName: string; createdAt: string } | null;
  productName?: string | null;
  productType?: string | null;
  onShowToast?: (message: string) => void;
}

export function Results({
  result,
  isLoading,
  error,
  selectedOptions,
  setCurrentView,
  viewDataOverride = null,
  backTarget = "new-analysis",
  historyMeta = null,
  productName = null,
  productType = null,
  onShowToast,
}: ResultsProps) {
  const [slackStatus, setSlackStatus] = useState<SlackStatus>("idle");
  const [slackError, setSlackError] = useState<string | null>(null);
  const [driveStatus, setDriveStatus] = useState<DriveStatus>("idle");
  const [driveError, setDriveError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [driveSaved, setDriveSaved] = useState(false);

  const computedViewData = useMemo(
    () => (result ? mapToResultsViewData(result, selectedOptions) : null),
    [result, selectedOptions]
  );
  const viewData = viewDataOverride ?? computedViewData;

  const goBack = () => setCurrentView(backTarget);
  const goToNewAnalysis = () => setCurrentView("new-analysis");
  const goToDashboard = () => setCurrentView("dashboard");

  const handleShareToSlack = async () => {
    if (!viewData || slackStatus === "loading" || slackStatus === "success") return;
    setSlackStatus("loading");
    setSlackError(null);

    try {
      await sendToSlack({
        productName: historyMeta?.productName ?? productName ?? "Unknown Product",
        score: viewData.scoreCard.score,
        recommendation: viewData.recommendation.decision,
        summary: viewData.executiveSummary,
        topRisks: viewData.risks.slice(0, 5).map((r) => ({
          risk: r.risk,
          severity: r.severity,
        })),
      });
      setSlackStatus("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send to Slack.";
      setSlackError(message);
      setSlackStatus("error");
    }
  };

  const handleExportToDrive = async () => {
    if (!viewData || driveStatus === "uploading" || driveStatus === "saved") return;
    setDriveStatus("uploading");
    setDriveError(null);

    try {
      await exportToDrive({
        productName: historyMeta?.productName ?? productName ?? "Unknown Product",
        score: viewData.scoreCard.score,
        recommendation: viewData.recommendation.decision,
        summary: viewData.executiveSummary,
        risks: viewData.risks,
        missingRequirements: viewData.missingRequirements,
        aiRecommendations: viewData.aiRecommendations,
      });
      setDriveStatus("saved");
      setDriveSaved(true);
      setToastMessage("Report saved to Google Drive");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Export to Google Drive failed.";
      setDriveError(message);
      setDriveStatus("error");
    }
  };

  return (
    <div className="pb-12 space-y-8">
      <div>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icons.externalLink className="w-4 h-4 rotate-180" />
          {backTarget === "history" ? "Back to History" : "Back"}
        </button>
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
          AI Analysis Results
        </h2>
        <p className="text-muted-foreground">
          {historyMeta
            ? `Viewing saved analysis for ${historyMeta.productName} — ${new Date(historyMeta.createdAt).toLocaleDateString()}`
            : "Review AI-generated launch insights before making a release decision."}
        </p>
      </div>

      {driveSaved && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Report saved to Google Drive"
          data-testid="drive-success-banner"
          className="flex items-center gap-2 px-4 py-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium"
        >
          <Icons.checkCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          Report saved to Google Drive
        </div>
      )}

      {isLoading && <ResultsSkeleton />}

      {!isLoading && error && (
        <ResultsError message={error} onRetry={goToNewAnalysis} onReturnToDashboard={goToDashboard} />
      )}

      {!isLoading && !error && !viewData && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
          <div className="bg-muted/50 p-6 rounded-full mb-6">
            <Icons.externalLink className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-2">No Analysis Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Run a new analysis to see results here.
          </p>
          <button
            onClick={goToNewAnalysis}
            className="px-6 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start New Analysis
          </button>
        </div>
      )}

      {!isLoading && !error && viewData && (
        <>
          <ScoreCard score={viewData.scoreCard.score} riskLevel={viewData.scoreCard.riskLevel} />
          <ExecutiveSummary summary={viewData.executiveSummary} keyObservations={viewData.keyObservations} />
          <RecommendationCard
            decision={viewData.recommendation.decision}
            confidence={viewData.recommendation.confidence}
            explanation={viewData.recommendation.explanation}
          />
          <RisksTable risks={viewData.risks} />
          <MissingRequirements items={viewData.missingRequirements} />
          <AIRecommendations recommendations={viewData.aiRecommendations} />
          <SelectedOptions options={viewData.selectedOptions} />
          <ResultsActions
            onRunNewAnalysis={goToNewAnalysis}
            onReturnToDashboard={goToDashboard}
            onShareToSlack={handleShareToSlack}
            slackStatus={slackStatus}
            slackError={slackError}
            onExportToDrive={handleExportToDrive}
            driveStatus={driveStatus}
            driveError={driveError}
          />
        </>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
          durationMs={6000}
        />
      )}
    </div>
  );
}
