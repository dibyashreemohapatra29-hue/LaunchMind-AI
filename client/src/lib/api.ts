export interface AnalysisOptions {
  riskAssessment: boolean;
  launchReadinessScore: boolean;
  missingRequirements: boolean;
  executiveSummary: boolean;
  goNoGoRecommendation: boolean;
}

export interface AnalyzePrdRequest {
  productName: string;
  productType: string;
  prdText: string;
  options: AnalysisOptions;
}

export interface AnalysisResult {
  executiveSummary?: string;
  launchReadinessScore?: number;
  risks?: { title: string; severity: "low" | "medium" | "high"; description: string }[];
  missingRequirements?: string[];
  goNoGoRecommendation?: {
    decision: "go" | "no-go" | "conditional";
    rationale: string;
  };
}

export async function analyzePrd(payload: AnalyzePrdRequest): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || "Failed to analyze PRD. Please try again.";
    throw new Error(message);
  }

  return data.result as AnalysisResult;
}

export interface SlackSharePayload {
  productName: string;
  score: number;
  recommendation: string;
  summary: string;
  topRisks: { risk: string; severity: string }[];
}

export async function sendToSlack(payload: SlackSharePayload): Promise<void> {
  const response = await fetch("/api/slack/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || "Unable to send message.";
    throw new Error(message);
  }
}

export async function getSlackStatus(): Promise<{ configured: boolean }> {
  const response = await fetch("/api/slack/status").catch(() => null);
  if (!response || !response.ok) return { configured: false };
  return response.json().catch(() => ({ configured: false }));
}
