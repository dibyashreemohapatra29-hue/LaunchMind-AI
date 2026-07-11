import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Dashboard } from "../../pages/Dashboard";
import { Integrations } from "../../pages/Integrations";
import { PlaceholderPage } from "../../pages/PlaceholderPage";
import { NewAnalysis } from "../../pages/NewAnalysis";
import { Results } from "../../pages/Results";
import { HistoryPage } from "../../features/history/HistoryPage";
import { WorkspacePage } from "../../features/workspace/WorkspacePage";
import { ExecutiveDashboard } from "../../pages/ExecutiveDashboard";
import { Toast } from "../ui/Toast";
import { analyzePrd, AnalysisResult, AnalyzePrdRequest } from "../../lib/api";
import { AnalysisConfig } from "../../components/new-analysis/AnalysisOptions";
import { mapToResultsViewData, ResultsViewData } from "../../lib/resultsMapper";
import { saveAnalysisToHistory, fetchAnalysisById } from "../../lib/historyApi";

export function DashboardLayout() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<AnalysisConfig | null>(
    null,
  );
  const [historyViewData, setHistoryViewData] =
    useState<ResultsViewData | null>(null);
  const [historyMeta, setHistoryMeta] = useState<{
    productName: string;
    createdAt: string;
  } | null>(null);
  const [analysisProductName, setAnalysisProductName] = useState<string | null>(
    null,
  );
  const [analysisProductType, setAnalysisProductType] = useState<string | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const runAnalysis = async (payload: AnalyzePrdRequest) => {
    setSelectedOptions(payload.options);
    setAnalysisResult(null);
    setAnalysisError(null);
    setHistoryViewData(null);
    setHistoryMeta(null);
    setAnalysisProductName(payload.productName);
    setAnalysisProductType(payload.productType);
    setIsAnalyzing(true);
    setCurrentView("results");

    try {
      const result = await analyzePrd(payload);
      setAnalysisResult(result);

      const viewData = mapToResultsViewData(result, payload.options);
      console.log("Before saveAnalysisToHistory");
      try {
        await saveAnalysisToHistory({
          productName: payload.productName,
          productType: payload.productType,
          prdText: payload.prdText,
          viewData,
        });
        console.log("After saveAnalysisToHistory");
        setToastMessage("Analysis saved to history");
      } catch (saveErr) {
        console.error("SAVE FAILED", saveErr);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to analyze PRD. Please try again.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openHistoryEntry = async (id: string) => {
    setHistoryViewData(null);
    setHistoryMeta(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsAnalyzing(true);
    setCurrentView("results");

    try {
      const detail = await fetchAnalysisById(id);
      setHistoryViewData(detail.viewData);
      setHistoryMeta({
        productName: detail.productName,
        createdAt: detail.createdAt,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load this analysis. Please try again.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard setCurrentView={setCurrentView} />;
      case "executive-dashboard":
        return <ExecutiveDashboard setCurrentView={setCurrentView} />;
      case "integrations":
        return <Integrations />;
      case "new-analysis":
        return (
          <NewAnalysis
            setCurrentView={setCurrentView}
            onAnalyze={runAnalysis}
          />
        );
      case "results":
        return (
          <Results
            result={analysisResult}
            isLoading={isAnalyzing}
            error={analysisError}
            selectedOptions={selectedOptions}
            setCurrentView={setCurrentView}
            viewDataOverride={historyViewData}
            backTarget={historyViewData ? "history" : "new-analysis"}
            historyMeta={historyMeta}
            productName={analysisProductName}
            productType={analysisProductType}
          />
        );
      case "history":
        return (
          <HistoryPage
            setCurrentView={setCurrentView}
            onSelectAnalysis={openHistoryEntry}
          />
        );
      case "workspace":
        return <WorkspacePage setCurrentView={setCurrentView} />;
      case "settings":
        return (
          <PlaceholderPage
            title="Settings"
            description="Manage your LaunchMind AI preferences and workspace settings."
          />
        );
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentView={currentView}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}

// TODO: User Authentication — gate saved/viewed history to the signed-in user.
