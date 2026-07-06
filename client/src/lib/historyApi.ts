import { supabase } from "./supabase";
import { ResultsViewData, Decision } from "./resultsMapper";

// This module persists completed analyses to the existing Supabase project
// (client/src/lib/supabase.ts) in a table named `analysis_history`. See the
// project setup notes for the exact CREATE TABLE statement used to provision
// this table — it is not created by application code.

export interface HistorySummary {
  id: string;
  productName: string;
  productType: string;
  createdAt: string;
  readinessScore: number;
  recommendation: Decision;
}

export interface HistoryDetail extends HistorySummary {
  prdText: string;
  viewData: ResultsViewData;
}

interface AnalysisHistoryRow {
  id: string;
  created_at: string;
  product_name: string;
  product_type: string;
  prd_text: string;
  readiness_score: number;
  executive_summary: string;
  recommendation: string;
  recommendation_rationale: string | null;
  confidence_score: number;
  risk_assessment: ResultsViewData["risks"];
  missing_requirements: ResultsViewData["missingRequirements"];
  ai_recommendations: string[];
  selected_options: string[] | null;
}

const TABLE = "analysis_history";

function rowToSummary(row: AnalysisHistoryRow): HistorySummary {
  return {
    id: row.id,
    productName: row.product_name,
    productType: row.product_type,
    createdAt: row.created_at,
    readinessScore: row.readiness_score,
    recommendation: row.recommendation as Decision,
  };
}

function rowToDetail(row: AnalysisHistoryRow): HistoryDetail {
  return {
    ...rowToSummary(row),
    prdText: row.prd_text,
    viewData: {
      scoreCard: {
        score: row.readiness_score,
        riskLevel: row.readiness_score >= 75 ? "Low" : row.readiness_score >= 50 ? "Medium" : "High",
      },
      executiveSummary: row.executive_summary,
      keyObservations: row.executive_summary
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 4),
      recommendation: {
        decision: row.recommendation as Decision,
        confidence: row.confidence_score,
        explanation: row.recommendation_rationale ?? "No rationale was recorded for this analysis.",
      },
      risks: row.risk_assessment ?? [],
      missingRequirements: row.missing_requirements ?? [],
      aiRecommendations: row.ai_recommendations ?? [],
      selectedOptions: row.selected_options ?? [],
    },
  };
}

export interface SaveAnalysisPayload {
  productName: string;
  productType: string;
  prdText: string;
  viewData: ResultsViewData;
}

export async function saveAnalysisToHistory(payload: SaveAnalysisPayload): Promise<void> {
  const { error } = await supabase.from(TABLE).insert({
    product_name: payload.productName,
    product_type: payload.productType,
    prd_text: payload.prdText,
    readiness_score: payload.viewData.scoreCard.score,
    executive_summary: payload.viewData.executiveSummary,
    recommendation: payload.viewData.recommendation.decision,
    recommendation_rationale: payload.viewData.recommendation.explanation,
    confidence_score: payload.viewData.recommendation.confidence,
    risk_assessment: payload.viewData.risks,
    missing_requirements: payload.viewData.missingRequirements,
    ai_recommendations: payload.viewData.aiRecommendations,
    selected_options: payload.viewData.selectedOptions,
  });

  if (error) {
    throw new Error(error.message || "Failed to save analysis to history.");
  }
}

export async function fetchAnalysisHistory(): Promise<HistorySummary[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "id, created_at, product_name, product_type, readiness_score, recommendation"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load analysis history.");
  }

  return (data as AnalysisHistoryRow[]).map(rowToSummary);
}

export async function fetchAnalysisById(id: string): Promise<HistoryDetail> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single();

  if (error || !data) {
    throw new Error(error?.message || "Analysis not found.");
  }

  return rowToDetail(data as AnalysisHistoryRow);
}

// TODO: User Authentication — scope saved analyses to the authenticated user
// and add a `user_id` column + RLS policy once auth is introduced.
// TODO: Team Workspace — associate analyses with a workspace/team id so
// history can be shared across a team rather than being global.
