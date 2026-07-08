import { LaunchContext } from "../types/LaunchContext";
import { LaunchIntelligence } from "../types/LaunchIntelligence";
import { Decision, RiskLevel, RiskRow } from "../lib/resultsMapper";
import { ReadinessLevel, TimelineHealth, ConfidenceLevel } from "../types/LaunchIntelligence";

// ---------------------------------------------------------------------------
// DashboardService — the only place the Executive Dashboard reads business
// data from. It receives the already-computed LaunchIntelligence (from
// IntelligenceEngine) plus the LaunchContext it was derived from (for the
// integration/report status and recent-analysis fields the Intelligence
// Engine does not carry), and maps both into plain, typed view-model props
// for the dashboard widgets. It performs NO scoring/risk/confidence
// calculations of its own — those all come from the Intelligence Engine.
// ---------------------------------------------------------------------------

export interface LaunchReadinessViewModel {
  score: number;
  level: ReadinessLevel;
}

export interface DecisionViewModel {
  decision: Decision;
}

export interface TimelineHealthViewModel {
  health: TimelineHealth;
  message: string;
  analysisAgeHours: number | null;
  staleDataWarning: boolean;
}

export interface RiskSummaryViewModel {
  overallRisk: RiskLevel;
  criticalCount: number;
  mediumCount: number;
  lowCount: number;
  summary: string;
  criticalRisks: RiskRow[];
}

export interface ConfidenceViewModel {
  score: number;
  level: ConfidenceLevel;
}

export interface RecommendationViewModel {
  executiveRecommendation: string;
}

export interface PriorityActionsViewModel {
  priorityActions: string[];
  blockers: string[];
  nextSteps: string[];
}

export interface IntegrationStatusViewModel {
  slackConnected: boolean;
  slackShared: boolean;
  driveConnected: boolean;
  reportExported: boolean;
}

export interface RecentAnalysisViewModel {
  productName: string | null;
  productType: string | null;
  createdAt: string | null;
  totalAnalyses: number;
}

export interface ExecutiveDashboardViewModel {
  hasAnalysis: boolean;
  launchReadiness: LaunchReadinessViewModel;
  decision: DecisionViewModel;
  timeline: TimelineHealthViewModel;
  risk: RiskSummaryViewModel;
  confidence: ConfidenceViewModel;
  recommendation: RecommendationViewModel;
  priorityActions: PriorityActionsViewModel;
  integrationStatus: IntegrationStatusViewModel;
  recentAnalysis: RecentAnalysisViewModel;
  generatedAt: string;
}

export function buildDashboardViewModel(
  context: LaunchContext,
  intelligence: LaunchIntelligence
): ExecutiveDashboardViewModel {
  return {
    hasAnalysis: context.analysis !== null,
    launchReadiness: {
      score: intelligence.launchReadiness.launchReadinessScore,
      level: intelligence.launchReadiness.readinessLevel,
    },
    decision: {
      decision: intelligence.launchReadiness.decision,
    },
    timeline: {
      health: intelligence.timeline.timelineHealth,
      message: intelligence.timeline.timelineMessage,
      analysisAgeHours: intelligence.timeline.analysisAge,
      staleDataWarning: intelligence.timeline.staleDataWarning,
    },
    risk: {
      overallRisk: intelligence.risk.overallRisk,
      criticalCount: intelligence.risk.criticalRisks.length,
      mediumCount: intelligence.risk.mediumRisks.length,
      lowCount: intelligence.risk.lowRisks.length,
      summary: intelligence.risk.riskSummary,
      criticalRisks: intelligence.risk.criticalRisks,
    },
    confidence: {
      score: intelligence.confidence.overallConfidence,
      level: intelligence.confidence.confidenceLevel,
    },
    recommendation: {
      executiveRecommendation: intelligence.recommendation.executiveRecommendation,
    },
    priorityActions: {
      priorityActions: intelligence.recommendation.priorityActions,
      blockers: intelligence.recommendation.blockers,
      nextSteps: intelligence.recommendation.nextSteps,
    },
    integrationStatus: {
      slackConnected: context.integrationStatus.slack.connected,
      slackShared: context.launchMetrics.slackShared,
      driveConnected: context.integrationStatus.googleDrive.connected,
      reportExported: context.launchMetrics.reportExported,
    },
    recentAnalysis: {
      productName: context.launch.productName,
      productType: context.launch.productType,
      createdAt: context.timestamps.analysisCreatedAt,
      totalAnalyses: context.history.totalAnalyses,
    },
    generatedAt: intelligence.generatedAt,
  };
}
