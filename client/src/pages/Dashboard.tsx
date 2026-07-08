import { HeroSection } from "../components/dashboard/HeroSection";
import { QuickActions } from "../components/dashboard/QuickActions";
import { KpiCards } from "../components/dashboard/KpiCards";
import { RecentAnalysesTable } from "../components/dashboard/RecentAnalysesTable";
import { RecentActivity } from "../components/dashboard/RecentActivity";

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <HeroSection onNewAnalysis={() => setCurrentView("new-analysis")} />
      <QuickActions setCurrentView={setCurrentView} />
      <KpiCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-12">
        <div className="lg:col-span-2">
          <RecentAnalysesTable />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
