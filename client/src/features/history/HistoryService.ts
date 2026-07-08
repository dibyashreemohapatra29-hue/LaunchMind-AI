import { supabase } from "../../lib/supabase";
import { Decision, RiskLevel } from "../../lib/resultsMapper";
import { HistoryItem, HistorySummary, HistoryStatistics, LaunchHistory, TrendDirection } from "./HistoryTypes";

// ---------------------------------------------------------------------------
// HistoryService
//
// Reads existing analyses from Supabase (the same `analysis_history` table
// used by client/src/lib/historyApi.ts) and transforms them into the
// strongly typed LaunchHistory shape. This module never calls Gemini and
// never recalculates AI outputs — it only formats data that was already
// produced and saved by the existing analysis pipeline.
// ---------------------------------------------------------------------------

const TABLE = "analysis_history";

interface AnalysisHistoryRow {
  id: string;
  created_at: string;
  product_name: string;
  product_type: string;
  readiness_score: number;
  recommendation: string;
  recommendation_rationale: string | null;
  confidence_score: number;
}

function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

function rowToHistoryItem(row: AnalysisHistoryRow): HistoryItem {
  return {
    id: row.id,
    productName: row.product_name,
    productType: row.product_type,
    analysisDate: row.created_at,
    launchReadiness: row.readiness_score,
    decision: row.recommendation as Decision,
    riskLevel: scoreToRiskLevel(row.readiness_score),
    confidence: row.confidence_score,
    recommendation: row.recommendation_rationale ?? "No rationale was recorded for this analysis.",
    // A saved analysis always has a viewable report.
    reportAvailable: true,
    // TODO: Share/Export Tracking — Slack and Google Drive integrations are
    // currently stateless (no per-analysis share/export record is persisted).
    // Once that tracking exists, populate these from the real record instead
    // of defaulting to false.
    slackShared: false,
    driveExported: false,
  };
}

export async function fetchLaunchHistoryItems(): Promise<HistoryItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "id, created_at, product_name, product_type, readiness_score, recommendation, recommendation_rationale, confidence_score"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load launch history.");
  }

  return (data as AnalysisHistoryRow[]).map(rowToHistoryItem);
}

function buildSummary(items: HistoryItem[]): HistorySummary {
  if (items.length === 0) {
    return {
      totalLaunches: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      goCount: 0,
      goWithRiskCount: 0,
      noGoCount: 0,
      lastLaunchDate: null,
    };
  }

  const scores = items.map((item) => item.launchReadiness);

  return {
    totalLaunches: items.length,
    averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    goCount: items.filter((item) => item.decision === "GO").length,
    goWithRiskCount: items.filter((item) => item.decision === "GO WITH RISKS").length,
    noGoCount: items.filter((item) => item.decision === "NO-GO").length,
    // items are ordered newest-first.
    lastLaunchDate: items[0].analysisDate,
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function trendFromAverages(olderAverage: number, recentAverage: number): TrendDirection {
  const delta = recentAverage - olderAverage;
  if (Math.abs(delta) < 0.5) return "Stable";
  return delta > 0 ? "Improving" : "Declining";
}

function decisionToScore(decision: Decision): number {
  if (decision === "GO") return 2;
  if (decision === "GO WITH RISKS") return 1;
  return 0;
}

function riskLevelToScore(riskLevel: RiskLevel): number {
  if (riskLevel === "Low") return 2;
  if (riskLevel === "Medium") return 1;
  return 0;
}

function buildStatistics(items: HistoryItem[]): HistoryStatistics {
  if (items.length < 2) {
    return {
      scoreTrend: "Insufficient Data",
      decisionTrend: "Insufficient Data",
      riskTrend: "Insufficient Data",
      confidenceTrend: "Insufficient Data",
    };
  }

  // `items` is newest-first; reverse to chronological (oldest-first) order so
  // "older half" vs "recent half" reflects the real timeline.
  const chronological = [...items].reverse();
  const midpoint = Math.floor(chronological.length / 2);
  const olderHalf = chronological.slice(0, midpoint);
  const recentHalf = chronological.slice(midpoint);

  return {
    scoreTrend: trendFromAverages(
      average(olderHalf.map((item) => item.launchReadiness)),
      average(recentHalf.map((item) => item.launchReadiness))
    ),
    decisionTrend: trendFromAverages(
      average(olderHalf.map((item) => decisionToScore(item.decision))),
      average(recentHalf.map((item) => decisionToScore(item.decision)))
    ),
    riskTrend: trendFromAverages(
      average(olderHalf.map((item) => riskLevelToScore(item.riskLevel))),
      average(recentHalf.map((item) => riskLevelToScore(item.riskLevel)))
    ),
    confidenceTrend: trendFromAverages(
      average(olderHalf.map((item) => item.confidence)),
      average(recentHalf.map((item) => item.confidence))
    ),
  };
}

export async function fetchLaunchHistory(): Promise<LaunchHistory> {
  const items = await fetchLaunchHistoryItems();

  return {
    items,
    summary: buildSummary(items),
    statistics: buildStatistics(items),
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Future providers — intentionally unimplemented placeholders (foundation
// for future RAG work). Do not implement vector search, embeddings, or
// semantic search here.
// ---------------------------------------------------------------------------

// TODO: semanticSearch(query: string): Promise<HistoryItem[]>
// TODO: vectorSearch(embedding: number[]): Promise<HistoryItem[]>
// TODO: similarLaunches(item: HistoryItem): Promise<HistoryItem[]>
// TODO: timelinePrediction(history: LaunchHistory): Promise<unknown>
