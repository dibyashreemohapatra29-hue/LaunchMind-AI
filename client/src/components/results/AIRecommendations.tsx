
interface AIRecommendationsProps {
  recommendations: string[];
}

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">AI Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((recommendation, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
