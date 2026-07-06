import { AnalysisResult } from "./api";
import { AnalysisConfig } from "../components/new-analysis/AnalysisOptions";

// NOTE: The Gemini-backed /api/analyze endpoint currently returns only:
// executiveSummary, launchReadinessScore, risks (title/severity/description),
// missingRequirements (string[]), goNoGoRecommendation (decision/rationale).
// Per this task's spec ("Use mock API data", "Assume the API already returns
// valid JSON", "Do NOT modify backend files / Gemini service"), fields the
// backend does not yet provide (risk impact/suggested action, missing
// requirement descriptions/priority, recommendation confidence, key
// observations, AI recommendations) are filled in here with sample/mock data
// so the richer Results page layout can be built without touching the
// backend. Swap these mocked sections for real data once the Gemini schema
// is extended in a future task.

export type RiskLevel = "Low" | "Medium" | "High";
export type Decision = "GO" | "GO WITH RISKS" | "NO-GO";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Severity = "High" | "Medium" | "Low";

export interface ScoreCardData {
  score: number;
  riskLevel: RiskLevel;
}

export interface RecommendationData {
  decision: Decision;
  confidence: number;
  explanation: string;
}

export interface RiskRow {
  risk: string;
  severity: Severity;
  impact: string;
  suggestedAction: string;
}

export interface MissingRequirementItem {
  title: string;
  description: string;
  priority: Priority;
}

export interface ResultsViewData {
  scoreCard: ScoreCardData;
  executiveSummary: string;
  keyObservations: string[];
  recommendation: RecommendationData;
  risks: RiskRow[];
  missingRequirements: MissingRequirementItem[];
  aiRecommendations: string[];
  selectedOptions: string[];
}

const OPTION_LABELS: Record<keyof AnalysisConfig, string> = {
  riskAssessment: "Risk Assessment",
  launchReadinessScore: "Launch Readiness Score",
  missingRequirements: "Missing Requirements",
  executiveSummary: "Executive Summary",
  goNoGoRecommendation: "Go / No-Go Recommendation",
};

const MOCK_IMPACT_BY_SEVERITY: Record<Severity, string> = {
  High: "Could block launch or cause major user-facing issues.",
  Medium: "May degrade experience or delay timelines if unresolved.",
  Low: "Minor concern, unlikely to affect launch outcome.",
};

const MOCK_ACTION_BY_SEVERITY: Record<Severity, string> = {
  High: "Escalate to eng lead and resolve before launch.",
  Medium: "Schedule a fix and monitor closely post-launch.",
  Low: "Track in backlog for a future iteration.",
};

// Mock sample rows used to pad the table to at least 5 rows when the API
// returns fewer identified risks.
const SAMPLE_RISK_POOL: RiskRow[] = [
  {
    risk: "No offline mode",
    severity: "Medium",
    impact: MOCK_IMPACT_BY_SEVERITY.Medium,
    suggestedAction: MOCK_ACTION_BY_SEVERITY.Medium,
  },
  {
    risk: "iOS push notifications unimplemented",
    severity: "High",
    impact: MOCK_IMPACT_BY_SEVERITY.High,
    suggestedAction: MOCK_ACTION_BY_SEVERITY.High,
  },
  {
    risk: "Limited QA coverage on edge cases",
    severity: "Medium",
    impact: MOCK_IMPACT_BY_SEVERITY.Medium,
    suggestedAction: MOCK_ACTION_BY_SEVERITY.Medium,
  },
  {
    risk: "No rollback plan documented",
    severity: "High",
    impact: MOCK_IMPACT_BY_SEVERITY.High,
    suggestedAction: MOCK_ACTION_BY_SEVERITY.High,
  },
  {
    risk: "Analytics events not fully instrumented",
    severity: "Low",
    impact: MOCK_IMPACT_BY_SEVERITY.Low,
    suggestedAction: MOCK_ACTION_BY_SEVERITY.Low,
  },
];

const SAMPLE_MISSING_REQUIREMENT_POOL: MissingRequirementItem[] = [
  {
    title: "Accessibility audit",
    description: "No documented plan for WCAG compliance testing.",
    priority: "High",
  },
  {
    title: "Data retention policy",
    description: "PRD does not specify how long user data is retained.",
    priority: "Medium",
  },
  {
    title: "Localization strategy",
    description: "No mention of supported languages or locales.",
    priority: "Low",
  },
  {
    title: "Rate limiting",
    description: "API rate limits are not defined for public endpoints.",
    priority: "Critical",
  },
];

const MOCK_AI_RECOMMENDATIONS = [
  "Add automated integration tests covering the top identified risks before launch.",
  "Document a rollback and incident response plan for the initial release window.",
  "Close the highest-priority missing requirements identified above ahead of launch.",
  "Run a limited beta with a small user cohort to validate assumptions before full rollout.",
];

function severityToTitleCase(severity: "low" | "medium" | "high"): Severity {
  if (severity === "high") return "High";
  if (severity === "medium") return "Medium";
  return "Low";
}

function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

function decisionToDisplay(decision: "go" | "no-go" | "conditional"): Decision {
  if (decision === "go") return "GO";
  if (decision === "no-go") return "NO-GO";
  return "GO WITH RISKS";
}

function deriveKeyObservations(summary: string): string[] {
  const sentences = summary
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sentences.slice(0, 4);
}

export function mapToResultsViewData(
  result: AnalysisResult,
  options: AnalysisConfig | null
): ResultsViewData {
  const score = result.launchReadinessScore ?? 72; // mock fallback
  const scoreCard: ScoreCardData = {
    score,
    riskLevel: scoreToRiskLevel(score),
  };

  const executiveSummary =
    result.executiveSummary ??
    "Executive summary was not returned for this analysis. This is placeholder content pending a full summary from the AI model.";
  const keyObservations = deriveKeyObservations(executiveSummary);

  const recommendation: RecommendationData = {
    decision: result.goNoGoRecommendation
      ? decisionToDisplay(result.goNoGoRecommendation.decision)
      : "GO WITH RISKS",
    confidence: 82, // mock — backend does not currently return a confidence score
    explanation:
      result.goNoGoRecommendation?.rationale ??
      "No explicit recommendation was returned. Review the risks and missing requirements below before deciding.",
  };

  const apiRisks: RiskRow[] = (result.risks ?? []).map((r) => {
    const severity = severityToTitleCase(r.severity);
    return {
      risk: r.title,
      severity,
      impact: MOCK_IMPACT_BY_SEVERITY[severity], // mock — backend has no impact field
      suggestedAction: MOCK_ACTION_BY_SEVERITY[severity], // mock — backend has no suggested action field
    };
  });

  const risks = [...apiRisks];
  let poolIndex = 0;
  while (risks.length < 5 && poolIndex < SAMPLE_RISK_POOL.length) {
    risks.push(SAMPLE_RISK_POOL[poolIndex]);
    poolIndex++;
  }

  const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];
  const apiMissingRequirements: MissingRequirementItem[] = (result.missingRequirements ?? []).map(
    (title, i) => ({
      title,
      description: "Not explicitly detailed in the PRD — flagged by AI analysis.", // mock
      priority: priorities[i % priorities.length], // mock — backend has no priority field
    })
  );

  const missingRequirements =
    apiMissingRequirements.length > 0 ? apiMissingRequirements : SAMPLE_MISSING_REQUIREMENT_POOL;

  const selectedOptions = options
    ? (Object.keys(options) as (keyof AnalysisConfig)[])
        .filter((key) => options[key])
        .map((key) => OPTION_LABELS[key])
    : [];

  return {
    scoreCard,
    executiveSummary,
    keyObservations,
    recommendation,
    risks,
    missingRequirements,
    aiRecommendations: MOCK_AI_RECOMMENDATIONS, // mock — backend has no recommendations field
    selectedOptions,
  };
}
