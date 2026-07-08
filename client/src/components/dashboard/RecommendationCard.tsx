import React from "react";
import { RecommendationViewModel } from "../../services/DashboardService";

export function RecommendationCard({ executiveRecommendation }: RecommendationViewModel) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Executive Recommendation</h3>
      <p className="text-sm text-foreground leading-relaxed">{executiveRecommendation}</p>
    </section>
  );
}
