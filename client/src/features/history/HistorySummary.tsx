import React from "react";
import { HistorySummary as HistorySummaryData, HistoryStatistics, TrendDirection } from "./HistoryTypes";
import { Icons } from "../../components/icons";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
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

const trendClasses: Record<TrendDirection, string> = {
  Improving: "text-emerald-600 bg-emerald-500/10",
  Declining: "text-destructive bg-destructive/10",
  Stable: "text-muted-foreground bg-muted",
  "Insufficient Data": "text-muted-foreground bg-muted",
};

function TrendBadge({ label, trend }: { label: string; trend: TrendDirection }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${trendClasses[trend]}`}>{trend}</span>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-muted/40 rounded-lg p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

interface DecisionDistributionProps {
  goCount: number;
  goWithRiskCount: number;
  noGoCount: number;
}

function DecisionDistribution({ goCount, goWithRiskCount, noGoCount }: DecisionDistributionProps) {
  const total = goCount + goWithRiskCount + noGoCount;
  const rows: { label: string; count: number; barClass: string }[] = [
    { label: "GO", count: goCount, barClass: "bg-emerald-500" },
    { label: "GO WITH RISKS", count: goWithRiskCount, barClass: "bg-amber-500" },
    { label: "NO-GO", count: noGoCount, barClass: "bg-destructive" },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const percent = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div key={row.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-foreground">{row.label}</span>
              <span className="text-muted-foreground">
                {row.count} ({percent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${row.barClass}`} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreTrendBars({ recentScores }: { recentScores: number[] }) {
  if (recentScores.length === 0) {
    return <p className="text-sm text-muted-foreground">No score history yet.</p>;
  }

  const max = Math.max(...recentScores, 1);

  return (
    <div className="flex items-end gap-1.5 h-20">
      {recentScores.map((score, index) => (
        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
          <div
            className="w-full rounded-t-sm bg-primary/70"
            style={{ height: `${Math.max((score / max) * 100, 4)}%` }}
            title={`${score}/100`}
          />
        </div>
      ))}
    </div>
  );
}

interface HistorySummaryCardProps {
  summary: HistorySummaryData;
  statistics: HistoryStatistics;
  recentScores: number[];
}

export function HistorySummaryCard({ summary, statistics, recentScores }: HistorySummaryCardProps) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icons.checkCircle className="w-4 h-4 text-primary" />
          Launch Summary
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Total Launches" value={summary.totalLaunches} />
          <StatTile label="Average Score" value={`${summary.averageScore}/100`} />
          <StatTile label="Highest Score" value={`${summary.highestScore}/100`} />
          <StatTile label="Lowest Score" value={`${summary.lowestScore}/100`} />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Last Launch</span>
          <span className="font-medium text-foreground">{formatDate(summary.lastLaunchDate)}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Decision Distribution</h3>
        <DecisionDistribution
          goCount={summary.goCount}
          goWithRiskCount={summary.goWithRiskCount}
          noGoCount={summary.noGoCount}
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Score Trend</h3>
        <ScoreTrendBars recentScores={recentScores} />
        <div className="mt-4 pt-3 border-t border-border divide-y divide-border">
          <TrendBadge label="Score" trend={statistics.scoreTrend} />
          <TrendBadge label="Decision" trend={statistics.decisionTrend} />
          <TrendBadge label="Risk" trend={statistics.riskTrend} />
          <TrendBadge label="Confidence" trend={statistics.confidenceTrend} />
        </div>
      </div>
    </div>
  );
}
