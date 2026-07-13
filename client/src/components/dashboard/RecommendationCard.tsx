import { RecommendationViewModel } from "../../services/DashboardService";

export function RecommendationCard({ executiveRecommendation }: RecommendationViewModel) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Executive Recommendation
        </h3>

        <p className="text-xs text-muted-foreground mt-1">
          AI-generated recommendation based on launch readiness, risks, and confidence.
        </p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm leading-relaxed text-foreground">
          {executiveRecommendation}
        </p>
      </div>
    </section>
  );
}
