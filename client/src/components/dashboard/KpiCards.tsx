import React from "react";
import { Icons } from "../icons";

export function KpiCards() {
  const kpis = [
    {
      title: "Analyses Completed",
      value: "128",
      trend: "+12% this month",
      trendUp: true,
      icon: Icons.checkCircle,
    },
    {
      title: "Launch Readiness Score",
      value: "84/100",
      trend: "Avg across active PRDs",
      trendUp: true,
      icon: Icons.fileText,
    },
    {
      title: "High Risk Findings",
      value: "14",
      trend: "-3 from last week",
      trendUp: true, // fewer risks is good
      icon: Icons.alertTriangle,
      alert: true,
    },
    {
      title: "Connected Integrations",
      value: "3/5",
      trend: "2 pending setup",
      trendUp: false,
      icon: Icons.integration,
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground">{kpi.title}</span>
              <div className={`p-2 rounded-md ${kpi.alert ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-2xl font-bold mb-1">{kpi.value}</div>
              <div className={`text-xs ${kpi.alert ? 'text-destructive' : 'text-muted-foreground'}`}>
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
