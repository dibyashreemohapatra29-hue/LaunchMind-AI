import { LaunchContext } from "../types/LaunchContext";
import { RecommendationEngineResult } from "../types/LaunchIntelligence";
import { MissingRequirementItem } from "../lib/resultsMapper";

// ---------------------------------------------------------------------------
// Recommendation Engine — aggregates recommendations already present in
// LaunchContext (AI recommendations + missing requirements). Never generates
// new recommendations or calls Gemini.
// ---------------------------------------------------------------------------

function highPriorityBlockers(items: MissingRequirementItem[]): string[] {
  return items.filter((i) => i.priority === "Critical" || i.priority === "High").map((i) => i.title);
}

function remainingAsNextSteps(items: MissingRequirementItem[]): string[] {
  return items
    .filter((i) => i.priority !== "Critical" && i.priority !== "High")
    .map((i) => i.title);
}

export function computeRecommendation(context: LaunchContext): RecommendationEngineResult {
  const aiRecommendations = context.analysis?.aiRecommendations ?? [];
  const missingRequirements = context.analysis?.missingRequirements ?? [];

  const executiveRecommendation =
    context.recommendation?.explanation ??
    context.analysis?.executiveSummary ??
    "No recommendation is available yet — run an analysis to generate one.";

  const blockers = highPriorityBlockers(missingRequirements);
  const nextSteps = [...remainingAsNextSteps(missingRequirements), ...aiRecommendations];

  return {
    executiveRecommendation,
    priorityActions: aiRecommendations,
    blockers,
    nextSteps,
  };
}
