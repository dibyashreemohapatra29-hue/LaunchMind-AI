import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Dashboard } from "../../pages/Dashboard";
import { Integrations } from "../../pages/Integrations";
import { PlaceholderPage } from "../../pages/PlaceholderPage";
import { NewAnalysis } from "../../pages/NewAnalysis";
import { Results } from "../../pages/Results";
import { analyzePrd, AnalysisResult, AnalyzePrdRequest } from "../../lib/api";
import { AnalysisConfig } from "../../components/new-analysis/AnalysisOptions";

export function DashboardLayout() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<AnalysisConfig | null>(null);

  const runAnalysis = async (payload: AnalyzePrdRequest) => {
    setSelectedOptions(payload.options);
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsAnalyzing(true);
    setCurrentView("results");

    try {
      const result = await analyzePrd(payload);
      setAnalysisResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze PRD. Please try again.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard setCurrentView={setCurrentView} />;
      case "integrations":
        return <Integrations />;
      case "new-analysis":
        return <NewAnalysis setCurrentView={setCurrentView} onAnalyze={runAnalysis} />;
      case "results":
        return (
          <Results
            result={analysisResult}
            isLoading={isAnalyzing}
            error={analysisError}
            selectedOptions={selectedOptions}
            setCurrentView={setCurrentView}
          />
        );
      case "history":
        return <PlaceholderPage title="Analysis History" description="View past PRD analyses and launch decisions." />;
      case "settings":
        return <PlaceholderPage title="Settings" description="Manage your LaunchMind AI preferences and workspace settings." />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar currentView={currentView} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
