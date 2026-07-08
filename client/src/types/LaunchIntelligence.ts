import { Decision, RiskLevel, RiskRow } from "../lib/resultsMapper";

// ---------------------------------------------------------------------------
// LaunchIntelligence — the single unified output of the Intelligence Engine.
// Every Intelligence Module below consumes ONLY LaunchContext (never Gemini,
// Supabase, Slack, or Google Drive directly) and returns through this shape.
// ---------------------------------------------------------------------------

export type ReadinessLevel = "Strong" | "Moderate" | "Weak";

export interface LaunchReadinessResult {
  launchReadinessScore: number;
  readinessLevel: ReadinessLevel;
  decision: Decision;
}

export type TimelineHealth = "Fresh" | "Aging" | "Stale";

export interface TimelineIntelligenceResult {
  analysisAge: number | null;
  contextFreshness: TimelineHealth;
  staleDataWarning: boolean;
  timelineHealth: TimelineHealth;
  timelineMessage: string;
}

export interface RiskIntelligenceResult {
  overallRisk: RiskLevel;
  criticalRisks: RiskRow[];
  mediumRisks: RiskRow[];
  lowRisks: RiskRow[];
  riskSummary: string;
}

export interface RecommendationEngineResult {
  executiveRecommendation: string;
  priorityActions: string[];
  blockers: string[];
  nextSteps: string[];
}

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ConfidenceEngineResult {
  overallConfidence: number;
  confidenceLevel: ConfidenceLevel;
}

export interface LaunchIntelligence {
  launchReadiness: LaunchReadinessResult;
  timeline: TimelineIntelligenceResult;
  risk: RiskIntelligenceResult;
  recommendation: RecommendationEngineResult;
  confidence: ConfidenceEngineResult;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Future intelligence placeholders — intentionally unimplemented.
// ---------------------------------------------------------------------------

// TODO: Predictive Launch Delay — estimate slip risk from history + timeline.
// TODO: GitHub Intelligence — factor PR/issue/CI signal into readiness + risk.
// TODO: Calendar Intelligence — factor milestone/deadline proximity into timeline.
// TODO: Deployment Intelligence — factor deployment/release health into readiness.
// TODO: RAG Intelligence — semantic recall across HistoryContext for recommendations.
