import { Decision, RiskLevel } from "../lib/resultsMapper";
import { HistorySummary } from "../lib/historyApi";
import {
  AnalysisContext,
  HistoryContext,
  LaunchMetrics,
  LaunchInfo,
} from "../types/LaunchContext";

// ---------------------------------------------------------------------------
// Pure helper functions used by ContextBuilder.ts to derive computed values.
// None of these call Gemini, Supabase, Slack, or Google Drive directly — they
// only transform data that has already been fetched by the caller.
// ---------------------------------------------------------------------------

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

export function riskLevelToHealth(riskLevel: RiskLevel): LaunchMetrics["overallHealth"] {
  if (riskLevel === "Low") return "Healthy";
  if (riskLevel === "Medium") return "At Risk";
  return "Critical";
}

export function hoursSince(isoTimestamp: string | null): number | null {
  if (!isoTimestamp) return null;
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) return null;
  return Math.max(0, Math.round((Date.now() - then) / (1000 * 60 * 60)));
}

export function buildHistoryContext(history: HistorySummary[]): HistoryContext {
  return {
    totalAnalyses: history.length,
    previousLaunches: history,
    previousScores: history.map((h) => h.readinessScore),
    previousRecommendations: history.map((h) => h.recommendation),
    lastUpdated: history.length > 0 ? history[0].createdAt : null,
  };
}

export function buildLaunchInfo(analysis: AnalysisContext | null): LaunchInfo {
  if (!analysis) {
    return { productName: null, productType: null, status: "no-data" };
  }
  return {
    productName: analysis.productName,
    productType: analysis.productType,
    status: "analyzed",
  };
}

export function computeLaunchMetrics(params: {
  analysis: AnalysisContext | null;
  historyAvailable: boolean;
  slackShared: boolean;
  reportExported: boolean;
}): LaunchMetrics {
  const { analysis, historyAvailable, slackShared, reportExported } = params;
  const readinessScore = analysis?.readinessScore ?? 0;
  const riskLevel = scoreToRiskLevel(readinessScore);

  return {
    overallHealth: analysis ? riskLevelToHealth(riskLevel) : "At Risk",
    riskLevel,
    launchReadiness: readinessScore,
    analysisAgeHours: hoursSince(analysis?.createdAt ?? null),
    historyAvailable,
    reportExported,
    slackShared,
  };
}

export function decisionFallback(value: string | undefined | null): Decision {
  if (value === "GO" || value === "NO-GO" || value === "GO WITH RISKS") return value;
  return "GO WITH RISKS";
}
