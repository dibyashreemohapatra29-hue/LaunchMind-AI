import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Dashboard } from "../../pages/Dashboard";
import { Integrations } from "../../pages/Integrations";
import { PlaceholderPage } from "../../pages/PlaceholderPage";

export function DashboardLayout() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard setCurrentView={setCurrentView} />;
      case "integrations":
        return <Integrations />;
      case "new-analysis":
        return <PlaceholderPage title="New Analysis" description="Upload a PRD to begin a new risk and readiness analysis." />;
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
