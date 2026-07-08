import { LaunchContext } from "../types/LaunchContext";
import { LaunchIntelligence } from "../types/LaunchIntelligence";
import { computeLaunchReadiness } from "./LaunchReadinessEngine";
import { computeTimelineIntelligence } from "./TimelineIntelligence";
import { computeRiskIntelligence } from "./RiskIntelligence";
import { computeRecommendation } from "./RecommendationEngine";
import { computeConfidence } from "./ConfidenceEngine";

// ---------------------------------------------------------------------------
// IntelligenceEngine — orchestrates all Intelligence Modules and returns one
// unified LaunchIntelligence object. Consumes ONLY a LaunchContext (produced
// by ContextEngine.getLaunchContext()); never reads Gemini, Supabase, Slack,
// or Google Drive directly, and never calls Gemini itself.
// ---------------------------------------------------------------------------

export function buildLaunchIntelligence(context: LaunchContext): LaunchIntelligence {
  return {
    launchReadiness: computeLaunchReadiness(context),
    timeline: computeTimelineIntelligence(context),
    risk: computeRiskIntelligence(context),
    recommendation: computeRecommendation(context),
    confidence: computeConfidence(context),
    generatedAt: new Date().toISOString(),
  };
}

export type { LaunchIntelligence } from "../types/LaunchIntelligence";
