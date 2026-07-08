import { Decision, RiskLevel } from "../../lib/resultsMapper";
import { LaunchMetrics } from "../../types/LaunchContext";

// ---------------------------------------------------------------------------
// Workspace types — a Workspace is a logical grouping of existing launches.
// It is NOT a multi-tenant concept: there is no authentication, no
// organizations, and no permissions. Everything here is derived by reading
// and formatting existing Supabase analyses (via the existing HistoryService)
// — nothing is recalculated or re-analyzed.
// ---------------------------------------------------------------------------

export type OverallHealth = LaunchMetrics["overallHealth"];

export type LaunchStatus = "Ready" | "Needs Attention" | "Blocked";

export interface Launch {
  launchId: string;
  productName: string;
  productType: string;
  analysisDate: string;
  launchReadiness: number;
  decision: Decision;
  riskLevel: RiskLevel;
  confidence: number;
  status: LaunchStatus;
}

export interface Workspace {
  id: string;
  name: string;
  totalLaunches: number;
  latestLaunch: string | null;
  overallHealth: OverallHealth;
  averageReadiness: number;
}

export interface WorkspaceSnapshot {
  workspace: Workspace;
  launches: Launch[];
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string | null;
  status: "completed" | "pending";
  description: string;
}

// ---------------------------------------------------------------------------
// Not implemented in this module (out of scope per spec):
// - RAG / semantic search over workspace launches
// - GitHub Intelligence
// - Calendar Intelligence
// - Real multi-tenant workspaces (auth/organizations/permissions)
// ---------------------------------------------------------------------------
