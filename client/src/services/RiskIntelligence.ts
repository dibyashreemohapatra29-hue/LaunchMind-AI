import { LaunchContext } from "../types/LaunchContext";
import { RiskIntelligenceResult } from "../types/LaunchIntelligence";
import { RiskLevel, RiskRow, Severity } from "../lib/resultsMapper";

// ---------------------------------------------------------------------------
// Risk Intelligence — categorizes the existing Risk Assessment already
// present in LaunchContext. Never generates new risks.
// ---------------------------------------------------------------------------

function bySeverity(risks: RiskRow[], severity: Severity): RiskRow[] {
  return risks.filter((r) => r.severity === severity);
}

function overallRiskFrom(risks: RiskRow[], contextRiskLevel: RiskLevel): RiskLevel {
  if (risks.some((r) => r.severity === "High")) return "High";
  if (risks.some((r) => r.severity === "Medium")) return "Medium";
  if (risks.length === 0) return contextRiskLevel;
  return "Low";
}

function summarize(critical: RiskRow[], medium: RiskRow[], low: RiskRow[]): string {
  const total = critical.length + medium.length + low.length;
  if (total === 0) {
    return "No risks have been identified in the current analysis.";
  }
  const parts: string[] = [];
  if (critical.length > 0) parts.push(`${critical.length} critical`);
  if (medium.length > 0) parts.push(`${medium.length} medium`);
  if (low.length > 0) parts.push(`${low.length} low`);
  return `${total} risk${total === 1 ? "" : "s"} identified (${parts.join(", ")}).`;
}

export function computeRiskIntelligence(context: LaunchContext): RiskIntelligenceResult {
  const risks = context.analysis?.riskAssessment ?? [];
  const criticalRisks = bySeverity(risks, "High");
  const mediumRisks = bySeverity(risks, "Medium");
  const lowRisks = bySeverity(risks, "Low");

  return {
    overallRisk: overallRiskFrom(risks, context.launchMetrics.riskLevel),
    criticalRisks,
    mediumRisks,
    lowRisks,
    riskSummary: summarize(criticalRisks, mediumRisks, lowRisks),
  };
}
