import { LaunchContext } from "../types/LaunchContext";
import { TimelineHealth, TimelineIntelligenceResult } from "../types/LaunchIntelligence";

// ---------------------------------------------------------------------------
// Timeline Intelligence — evaluates how fresh the underlying analysis is.
// Computed entirely from LaunchContext.launchMetrics.analysisAgeHours.
// ---------------------------------------------------------------------------

const FRESH_THRESHOLD_HOURS = 24;
const AGING_THRESHOLD_HOURS = 24 * 7;

function healthFromAge(ageHours: number | null): TimelineHealth {
  if (ageHours === null) return "Stale";
  if (ageHours <= FRESH_THRESHOLD_HOURS) return "Fresh";
  if (ageHours <= AGING_THRESHOLD_HOURS) return "Aging";
  return "Stale";
}

function messageFor(health: TimelineHealth, ageHours: number | null): string {
  if (ageHours === null) {
    return "No analysis timestamp is available yet.";
  }
  switch (health) {
    case "Fresh":
      return "Analysis is up to date.";
    case "Aging":
      return "Analysis is more than a day old — consider re-running before launch.";
    case "Stale":
    default:
      return "Analysis is over a week old and may no longer reflect the current state.";
  }
}

export function computeTimelineIntelligence(context: LaunchContext): TimelineIntelligenceResult {
  const ageHours = context.launchMetrics.analysisAgeHours;
  const health = healthFromAge(ageHours);

  return {
    analysisAge: ageHours,
    contextFreshness: health,
    staleDataWarning: health === "Stale",
    timelineHealth: health,
    timelineMessage: messageFor(health, ageHours),
  };
}
