import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Uses the javascript_gemini blueprint (Gemini Developer API key), not Vertex AI.
// Model kept as "gemini-2.5-flash" per blueprint guidance — do not change unless explicitly requested.

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisOptions {
  riskAssessment: boolean;
  launchReadinessScore: boolean;
  missingRequirements: boolean;
  executiveSummary: boolean;
  goNoGoRecommendation: boolean;
}

export interface AnalyzePrdInput {
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

function buildSchema(options: AnalysisOptions) {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  if (options.executiveSummary) {
    properties.executiveSummary = { type: "string" };
    required.push("executiveSummary");
  }
  if (options.launchReadinessScore) {
    properties.launchReadinessScore = { type: "number" };
    required.push("launchReadinessScore");
  }
  if (options.riskAssessment) {
    properties.risks = {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          description: { type: "string" },
        },
        required: ["title", "severity", "description"],
      },
    };
    required.push("risks");
  }
  if (options.missingRequirements) {
    properties.missingRequirements = { type: "array", items: { type: "string" } };
    required.push("missingRequirements");
  }
  if (options.goNoGoRecommendation) {
    properties.goNoGoRecommendation = {
      type: "object",
      properties: {
        decision: { type: "string", enum: ["go", "no-go", "conditional"] },
        rationale: { type: "string" },
      },
      required: ["decision", "rationale"],
    };
    required.push("goNoGoRecommendation");
  }

  return {
    type: "object",
    properties,
    required,
  };
}

export async function analyzePrd(input: AnalyzePrdInput): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const { productName, productType, prdText, options } = input;

  const systemInstruction = `You are an expert product launch analyst. You review Product Requirements Documents (PRDs) and provide a rigorous, actionable launch-readiness analysis. Be specific, reference details from the PRD, and avoid generic filler.`;

  const prompt = `Analyze the following PRD for launch readiness.

Product Name: ${productName}
Product Type: ${productType}

PRD Content:
"""
${prdText}
"""

Provide your analysis strictly as JSON matching the required schema.`;

  const schema = buildSchema(options);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    contents: prompt,
  });

  const rawJson = response.text;

  if (!rawJson) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(rawJson) as AnalysisResult;
  } catch {
    throw new Error("Failed to parse Gemini response as JSON.");
  }
}
