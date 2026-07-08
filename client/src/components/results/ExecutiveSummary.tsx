
interface ExecutiveSummaryProps {
  summary: string;
  keyObservations: string[];
}

export function ExecutiveSummary({ summary, keyObservations }: ExecutiveSummaryProps) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Executive Summary</h3>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-5">{summary}</p>

      {keyObservations.length > 0 && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Key Observations
          </h4>
          <ul className="space-y-2">
            {keyObservations.map((observation, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>{observation}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
