import { Decision, RiskLevel, RiskRow, MissingRequirementItem } from "../lib/resultsMapper";
import { HistorySummary } from "../lib/historyApi";

// ---------------------------------------------------------------------------
// LaunchContext — the single source of truth consumed by every future
// Intelligence Module. Nothing downstream should read directly from Gemini,
// Supabase, Slack, or Google Drive — everything flows through this object,
// produced by services/ContextBuilder.ts.
// ---------------------------------------------------------------------------

/** Snapshot of the current (or most recent) AI analysis. */
export interface AnalysisContext {
  productName: string;
  productType: string;
  readinessScore: number;
  executiveSummary: string;
  recommendation: Decision;
  confidenceScore: number;
  missingRequirements: MissingRequirementItem[];
  aiRecommendations: string[];
  riskAssessment: RiskRow[];
  createdAt: string | null;
}

/** Aggregated view of prior launches pulled from existing Supabase history. */
export interface HistoryContext {
  totalAnalyses: number;
  previousLaunches: HistorySummary[];
  previousScores: number[];
  previousRecommendations: Decision[];
  lastUpdated: string | null;
}

/** Status of a single currently-implemented integration. */
export interface IntegrationEntry {
  connected: boolean;
  lastShared?: string | null;
  lastExported?: string | null;
}

/** Placeholder shape for integrations that do not exist yet. */
export interface FutureIntegrationEntry {
  connected: false;
  status: "not_implemented";
}

export interface IntegrationContext {
  slack: IntegrationEntry;
  googleDrive: IntegrationEntry;
  // TODO: GitHub Provider — populate once a GitHub integration exists.
  github: FutureIntegrationEntry;
  // TODO: Calendar Provider — populate once a calendar integration exists.
  calendar: FutureIntegrationEntry;
}

/** Derived, computed-only metrics — never sourced from a fresh Gemini call. */
export interface LaunchMetrics {
  overallHealth: "Healthy" | "At Risk" | "Critical";
  riskLevel: RiskLevel;
  launchReadiness: number;
  analysisAgeHours: number | null;
  historyAvailable: boolean;
  reportExported: boolean;
  slackShared: boolean;
}

export interface RecommendationContext {
  decision: Decision;
  confidence: number;
  explanation: string;
}

export interface LaunchContextMetadata {
  generatedAt: string;
  source: "ContextBuilder";
  version: string;
}

/** Reserved for future multi-tenant / team support. Not implemented. */
export interface WorkspaceContext {
  // TODO: Workspace Provider — populate with team/workspace id + name once
  // multi-tenant workspaces are introduced.
  id: string | null;
  name: string | null;
}

export interface LaunchInfo {
  productName: string | null;
  productType: string | null;
  status: "no-data" | "analyzed";
}

export interface LaunchContext {
  analysis: AnalysisContext | null;
  history: HistoryContext;
  metadata: LaunchContextMetadata;
  integrationStatus: IntegrationContext;
  launchMetrics: LaunchMetrics;
  recommendation: RecommendationContext | null;
  confidence: number | null;
  timestamps: {
    analysisCreatedAt: string | null;
    contextBuiltAt: string;
  };
  workspace: WorkspaceContext;
  launch: LaunchInfo;
}

// ---------------------------------------------------------------------------
// Future provider placeholders — intentionally unimplemented. Each future
// Intelligence Module provider should slot into ContextBuilder.ts and extend
// LaunchContext without altering the fields above.
// ---------------------------------------------------------------------------

// TODO: GitHub Provider — pull PR/issue/CI signal into IntegrationContext.github.
// TODO: Calendar Provider — pull launch-date/milestone signal into a new
//       `timeline` section once scheduling data exists.
// TODO: RAG Provider — enable semantic search over HistoryContext once
//       embeddings storage is introduced.
// TODO: Workspace Provider — populate WorkspaceContext once team accounts exist.
// TODO: Timeline Provider — aggregate milestone/deadline data into LaunchContext.
