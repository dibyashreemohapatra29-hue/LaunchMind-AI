import { LaunchContext } from "../types/LaunchContext";
import { ConfidenceEngineResult, ConfidenceLevel } from "../types/LaunchIntelligence";

// ---------------------------------------------------------------------------
// Confidence Engine — computes overall confidence purely from the presence
// and completeness of data already inside LaunchContext (analysis
// completeness, history availability, integration availability). Never
// calls Gemini.
// ---------------------------------------------------------------------------

function levelFromScore(score: number): ConfidenceLevel {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function computeConfidence(context: LaunchContext): ConfidenceEngineResult {
  const analysisCompleteness = context.analysis
    ? Math.min(100, context.analysis.confidenceScore || 0)
    : 0;

  const historyAvailability = context.launchMetrics.historyAvailable ? 100 : 0;

  const integrationAvailability =
    (context.integrationStatus.slack.connected ? 50 : 0) +
    (context.integrationStatus.googleDrive.connected ? 50 : 0);

  const overallConfidence = Math.round(
    analysisCompleteness * 0.6 + historyAvailability * 0.25 + integrationAvailability * 0.15
  );

  return {
    overallConfidence,
    confidenceLevel: levelFromScore(overallConfidence),
  };
}
