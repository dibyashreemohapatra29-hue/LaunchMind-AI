import { useEffect, useState } from "react";
import { fetchLaunchHistory } from "../../features/history/HistoryService";
import { HistorySummary } from "../../features/history/HistoryTypes";
import { Icons } from "../icons";
export function KpiCards() {
  const [summary, setSummary] = useState<HistorySummary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const history = await fetchLaunchHistory();
        setSummary(history.summary);
      } catch (error) {
        console.error("Failed to load dashboard summary:", error);
      }
    }

    loadSummary();
  }, []);
  const kpis = [
    {
      title: "Analyses Completed",
      value: summary?.totalLaunches ?? 0,
      trend:
        (summary?.totalLaunches ?? 0) === 0
          ? "No analyses yet"
          : `${summary?.totalLaunches} analyses completed`,
      icon: Icons.checkCircle,
    },
    {
      title: "Launch Readiness Score",
      value: `${summary?.averageScore ?? 0}/100`,
      trend:
        (summary?.totalLaunches ?? 0) === 0
          ? "No analyses available"
          : "Average across your analyses",
      icon: Icons.fileText,
    },
    {
      title: "High Risk Findings",
      value: summary?.noGoCount ?? 0,
      trend:
        (summary?.noGoCount ?? 0) === 0
          ? "No high-risk launches"
          : `${summary?.noGoCount} No-Go recommendations`,
      icon: Icons.alertTriangle,
      alert: (summary?.noGoCount ?? 0) > 0,
    },
    {
      title: "Connected Integrations",
      value: "3/5",
      trend: "Slack, GitHub, Drive connected",
      icon: Icons.integration,
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Overview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </span>
              <div
                className={`p-2 rounded-md ${kpi.alert ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
              >
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-2xl font-bold mb-1">{kpi.value}</div>
              <div
                className={`text-xs ${kpi.alert ? "text-destructive" : "text-muted-foreground"}`}
              >
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
