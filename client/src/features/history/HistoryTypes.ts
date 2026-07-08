import { Decision, RiskLevel } from "../../lib/resultsMapper";

// ---------------------------------------------------------------------------
// Launch History types — strongly typed, read-only representations of
// existing analyses. Nothing here recalculates AI outputs; every field is
// either copied directly from a saved analysis or derived by simple,
// deterministic formatting (e.g. bucketing a score into a risk level).
// This is the foundation for future RAG features (see TODOs below) —
// vector search / embeddings / semantic search are intentionally NOT
// implemented here.
// ---------------------------------------------------------------------------

export interface HistoryItem {
  id: string;
  productName: string;
  productType: string;
  analysisDate: string;
  launchReadiness: number;
  decision: Decision;
  riskLevel: RiskLevel;
  confidence: number;
  recommendation: string;
  reportAvailable: boolean;
  slackShared: boolean;
  driveExported: boolean;
}

export type TrendDirection = "Improving" | "Declining" | "Stable" | "Insufficient Data";

export interface HistoryStatistics {
  scoreTrend: TrendDirection;
  decisionTrend: TrendDirection;
  riskTrend: TrendDirection;
  confidenceTrend: TrendDirection;
}

export interface HistorySummary {
  totalLaunches: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  goCount: number;
  goWithRiskCount: number;
  noGoCount: number;
  lastLaunchDate: string | null;
}

export interface LaunchHistory {
  items: HistoryItem[];
  summary: HistorySummary;
  statistics: HistoryStatistics;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Future providers — intentionally unimplemented. Each is a placeholder for
// the RAG foundation this module prepares the architecture for.
// ---------------------------------------------------------------------------

// TODO: semanticSearch(query: string): Promise<HistoryItem[]> — natural
//       language search over LaunchHistory once embeddings are introduced.
// TODO: vectorSearch(embedding: number[]): Promise<HistoryItem[]> — vector
//       similarity search once a vector store is introduced.
// TODO: similarLaunches(item: HistoryItem): Promise<HistoryItem[]> — surface
//       similar past launches for a given product/PRD.
// TODO: timelinePrediction(history: LaunchHistory): Promise<unknown> —
//       predict likely future launch timing from historical trends.
