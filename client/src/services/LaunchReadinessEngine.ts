import { LaunchContext } from "../types/LaunchContext";
import { LaunchReadinessResult, ReadinessLevel } from "../types/LaunchIntelligence";
import { Decision } from "../lib/resultsMapper";

// ---------------------------------------------------------------------------
// Launch Readiness Engine — derives a readiness score/level/decision purely
// from LaunchContext. Reuses the analysis already produced upstream; never
// calls Gemini or generates new analysis.
// ---------------------------------------------------------------------------

function scoreToReadinessLevel(score: number): ReadinessLevel {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Moderate";
  return "Weak";
}

function fallbackDecision(score: number): Decision {
  if (score >= 75) return "GO";
  if (score >= 50) return "GO WITH RISKS";
  return "NO-GO";
}

export function computeLaunchReadiness(context: LaunchContext): LaunchReadinessResult {
  const score = context.analysis?.readinessScore ?? context.launchMetrics.launchReadiness ?? 0;
  const decision = context.recommendation?.decision ?? context.analysis?.recommendation ?? fallbackDecision(score);

  return {
    launchReadinessScore: score,
    readinessLevel: scoreToReadinessLevel(score),
    decision,
  };
}
