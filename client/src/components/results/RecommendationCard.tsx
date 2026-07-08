import { RecommendationData } from "../../lib/resultsMapper";

const badgeClasses: Record<RecommendationData["decision"], string> = {
  GO: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "GO WITH RISKS": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "NO-GO": "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecommendationCard({ decision, confidence, explanation }: RecommendationData) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Go / No-Go Recommendation</h3>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${badgeClasses[decision]}`}>
          {decision}
        </span>
        <span className="text-sm text-muted-foreground">
          Confidence: <span className="font-semibold text-foreground">{confidence}%</span>
        </span>
      </div>

      <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
    </section>
  );
}
