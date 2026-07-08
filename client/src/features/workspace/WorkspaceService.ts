import { fetchLaunchHistoryItems } from "../history/HistoryService";
import { HistoryItem } from "../history/HistoryTypes";
import { buildLaunchContext } from "../../services/ContextBuilder";
import { buildLaunchIntelligence } from "../../services/IntelligenceEngine";
import { buildDashboardViewModel, ExecutiveDashboardViewModel } from "../../services/DashboardService";
import { fetchAnalysisById } from "../../lib/historyApi";
import { scoreToRiskLevel, riskLevelToHealth } from "../../utils/ContextHelpers";
import { Decision } from "../../lib/resultsMapper";
import { Launch, LaunchStatus, Workspace, WorkspaceSnapshot, TimelineEvent } from "./WorkspaceTypes";

// ---------------------------------------------------------------------------
// WorkspaceService
//
// Reads existing launch analyses (via the existing HistoryService, which
// itself reads existing Supabase data) and groups them into a single logical
// Workspace. Never calls Gemini, never recalculates AI outputs — decision,
// risk, readiness, and confidence are copied verbatim from saved analyses.
//
// A "workspace" here is purely a client-side grouping label; there is no
// multi-tenant backend, no authentication, and no organizations.
// ---------------------------------------------------------------------------

const WORKSPACE_ID = "default";
const WORKSPACE_NAME = "My Workspace";

function decisionToStatus(decision: Decision): LaunchStatus {
  if (decision === "GO") return "Ready";
  if (decision === "GO WITH RISKS") return "Needs Attention";
  return "Blocked";
}

function toLaunch(item: HistoryItem): Launch {
  return {
    launchId: item.id,
    productName: item.productName,
    productType: item.productType,
    analysisDate: item.analysisDate,
    launchReadiness: item.launchReadiness,
    decision: item.decision,
    riskLevel: item.riskLevel,
    confidence: item.confidence,
    status: decisionToStatus(item.decision),
  };
}

function buildWorkspaceSummary(launches: Launch[]): Workspace {
  if (launches.length === 0) {
    return {
      id: WORKSPACE_ID,
      name: WORKSPACE_NAME,
      totalLaunches: 0,
      latestLaunch: null,
      overallHealth: "At Risk",
      averageReadiness: 0,
    };
  }

  const averageReadiness = Math.round(
    launches.reduce((sum, launch) => sum + launch.launchReadiness, 0) / launches.length
  );

  return {
    id: WORKSPACE_ID,
    name: WORKSPACE_NAME,
    totalLaunches: launches.length,
    // `launches` is ordered newest-first (see fetchLaunchHistoryItems).
    latestLaunch: launches[0].analysisDate,
    overallHealth: riskLevelToHealth(scoreToRiskLevel(averageReadiness)),
    averageReadiness,
  };
}

/** Reads all existing analyses and groups them into the single logical
 *  workspace this MVP supports. Read-only — never writes to Supabase. */
export async function fetchWorkspace(): Promise<WorkspaceSnapshot> {
  const items = await fetchLaunchHistoryItems();
  const launches = items.map(toLaunch);

  return {
    workspace: buildWorkspaceSummary(launches),
    launches,
  };
}

/**
 * Builds the same Executive Dashboard view model the Executive Dashboard
 * page uses, but for an arbitrary previously-saved launch instead of the
 * most recent one. Reuses the existing Context Engine, Launch Intelligence,
 * and Dashboard Service untouched — it only supplies a different
 * `currentAnalysis` input (a past launch instead of a live one). No Gemini
 * call, no re-analysis — `fetchAnalysisById` reads the already-saved record.
 */
export async function fetchLaunchDashboard(launchId: string): Promise<ExecutiveDashboardViewModel> {
  const detail = await fetchAnalysisById(launchId);

  const context = await buildLaunchContext({
    currentAnalysis: {
      productName: detail.productName,
      productType: detail.productType,
      viewData: detail.viewData,
      createdAt: detail.createdAt,
    },
  });

  const intelligence = buildLaunchIntelligence(context);
  return buildDashboardViewModel(context, intelligence);
}

/**
 * Builds a chronological, read-only list of timeline events for a launch.
 * Slack/Drive share & export events are not yet tracked per-launch (both
 * integrations are stateless today — see ContextBuilder.ts TODOs) so those
 * rows reflect the current global integration connection state rather than
 * a real historical timestamp.
 */
export function buildLaunchTimeline(
  launch: Launch,
  integration: { slackConnected: boolean; slackShared: boolean; driveConnected: boolean; reportExported: boolean }
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "created",
      label: "Analysis Created",
      timestamp: launch.analysisDate,
      status: "completed",
      description: `${launch.productName} was analyzed and scored ${launch.launchReadiness}/100.`,
    },
    {
      id: "slack",
      label: "Slack Shared",
      timestamp: null,
      status: integration.slackShared ? "completed" : "pending",
      // TODO: Share Tracking — replace with a real per-launch timestamp once
      // Slack shares are recorded server-side.
      description: integration.slackConnected
        ? "Slack is connected. Per-launch share tracking is not yet implemented."
        : "Slack is not connected for this workspace.",
    },
    {
      id: "drive",
      label: "Drive Exported",
      timestamp: null,
      status: integration.reportExported ? "completed" : "pending",
      // TODO: Export Tracking — replace with a real per-launch timestamp once
      // Drive exports are recorded server-side.
      description: integration.driveConnected
        ? "Google Drive is connected. Per-launch export tracking is not yet implemented."
        : "Google Drive is not connected for this workspace.",
    },
  ];

  const latestActivity = events.reduce<string | null>((latest, event) => {
    if (!event.timestamp) return latest;
    if (!latest || new Date(event.timestamp) > new Date(latest)) return event.timestamp;
    return latest;
  }, null);

  events.push({
    id: "latest-activity",
    label: "Latest Activity",
    timestamp: latestActivity,
    status: "completed",
    description: latestActivity ? "Most recent recorded event for this launch." : "No activity recorded yet.",
  });

  events.push({
    id: "status",
    label: "Current Status",
    timestamp: null,
    status: launch.status === "Blocked" ? "pending" : "completed",
    description: `Launch is currently marked as "${launch.status}".`,
  });

  return events;
}

// TODO: Multi-Workspace Support — once authentication/organizations exist,
// group launches by a real workspace/team id instead of a single default
// group.
// TODO: semanticSearch / vectorSearch / similarLaunches / timelinePrediction
// — intentionally not implemented here; see features/history/HistoryTypes.ts
// for the same placeholders on the underlying launch history data.
