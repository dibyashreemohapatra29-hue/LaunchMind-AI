import { fetchAnalysisHistory, fetchAnalysisById, HistorySummary } from "../lib/historyApi";
import { getSlackStatus, getDriveStatus } from "../lib/api";
import { ResultsViewData } from "../lib/resultsMapper";
import {
  AnalysisContext,
  IntegrationContext,
  LaunchContext,
  RecommendationContext,
} from "../types/LaunchContext";
import {
  buildHistoryContext,
  buildLaunchInfo,
  computeLaunchMetrics,
} from "../utils/ContextHelpers";

const CONTEXT_VERSION = "1.0.0";

/** Optional info about the analysis currently being viewed (e.g. on the
 *  Results page). When omitted, the builder falls back to the most recent
 *  entry in existing Supabase history — it never re-runs Gemini. */
export interface CurrentAnalysisInput {
  productName: string;
  productType: string;
  viewData: ResultsViewData;
  createdAt?: string | null;
}

export interface BuildLaunchContextInput {
  currentAnalysis?: CurrentAnalysisInput | null;
}

function toAnalysisContext(input: CurrentAnalysisInput): AnalysisContext {
  const { viewData } = input;
  return {
    productName: input.productName,
    productType: input.productType,
    readinessScore: viewData.scoreCard.score,
    executiveSummary: viewData.executiveSummary,
    recommendation: viewData.recommendation.decision,
    confidenceScore: viewData.recommendation.confidence,
    missingRequirements: viewData.missingRequirements,
    aiRecommendations: viewData.aiRecommendations,
    riskAssessment: viewData.risks,
    createdAt: input.createdAt ?? null,
  };
}

/** Reuses existing history — fetches the most recent full record (if any)
 *  as a fallback when the caller does not supply a current analysis. Does
 *  not implement search/embeddings, per spec. */
async function deriveAnalysisFromHistory(
  history: HistorySummary[]
): Promise<AnalysisContext | null> {
  if (history.length === 0) return null;

  try {
    const detail = await fetchAnalysisById(history[0].id);
    return toAnalysisContext({
      productName: detail.productName,
      productType: detail.productType,
      viewData: detail.viewData,
      createdAt: detail.createdAt,
    });
  } catch {
    // Fall back to summary-only data if the full record can't be loaded.
    const latest = history[0];
    return {
      productName: latest.productName,
      productType: latest.productType,
      readinessScore: latest.readinessScore,
      executiveSummary: "",
      recommendation: latest.recommendation,
      confidenceScore: 0,
      missingRequirements: [],
      aiRecommendations: [],
      riskAssessment: [],
      createdAt: latest.createdAt,
    };
  }
}

async function buildIntegrationContext(): Promise<IntegrationContext> {
  const [slackStatus, driveStatus] = await Promise.all([
    getSlackStatus().catch(() => ({ configured: false })),
    getDriveStatus().catch(() => ({ configured: false })),
  ]);

  return {
    slack: {
      connected: slackStatus.configured,
      // TODO: persist a real `lastShared` timestamp once share events are
      // recorded server-side — Slack is currently stateless (webhook only).
      lastShared: null,
    },
    googleDrive: {
      connected: driveStatus.configured,
      // TODO: persist a real `lastExported` timestamp once export events are
      // recorded server-side — Drive uploads are currently stateless.
      lastExported: null,
    },
    // TODO: GitHub Provider — not implemented.
    github: { connected: false, status: "not_implemented" },
    // TODO: Calendar Provider — not implemented.
    calendar: { connected: false, status: "not_implemented" },
  };
}

function toRecommendationContext(analysis: AnalysisContext | null): RecommendationContext | null {
  if (!analysis) return null;
  return {
    decision: analysis.recommendation,
    confidence: analysis.confidenceScore,
    explanation: analysis.executiveSummary,
  };
}

/**
 * Collects analysis, history, and integration status, then assembles the
 * single LaunchContext object every future Intelligence Module should
 * consume. Never calls Gemini directly — analysis data is either passed in
 * by the caller (from an already-completed analysis) or read from existing
 * Supabase history.
 */
export async function buildLaunchContext(
  input: BuildLaunchContextInput = {}
): Promise<LaunchContext> {
  const history = await fetchAnalysisHistory().catch(() => [] as HistorySummary[]);

  const [analysis, integrationStatus] = await Promise.all([
    input.currentAnalysis
      ? Promise.resolve(toAnalysisContext(input.currentAnalysis))
      : deriveAnalysisFromHistory(history),
    buildIntegrationContext(),
  ]);

  const historyContext = buildHistoryContext(history);

  const launchMetrics = computeLaunchMetrics({
    analysis,
    historyAvailable: historyContext.totalAnalyses > 0,
    slackShared: integrationStatus.slack.connected,
    reportExported: integrationStatus.googleDrive.connected,
  });

  const nowIso = new Date().toISOString();

  const context: LaunchContext = {
    analysis,
    history: historyContext,
    metadata: {
      generatedAt: nowIso,
      source: "ContextBuilder",
      version: CONTEXT_VERSION,
    },
    integrationStatus,
    launchMetrics,
    recommendation: toRecommendationContext(analysis),
    confidence: analysis?.confidenceScore ?? null,
    timestamps: {
      analysisCreatedAt: analysis?.createdAt ?? null,
      contextBuiltAt: nowIso,
    },
    // TODO: Workspace Provider — not implemented, no multi-tenant support yet.
    workspace: { id: null, name: null },
    launch: buildLaunchInfo(analysis),
  };

  return context;
}
