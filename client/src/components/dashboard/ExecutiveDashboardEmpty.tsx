import { Icons } from "../icons";

interface ExecutiveDashboardEmptyProps {
  onCreateAnalysis: () => void;
}

export function ExecutiveDashboardEmpty({ onCreateAnalysis }: ExecutiveDashboardEmptyProps) {
  return (
    <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-muted/50 p-6 rounded-full mb-6">
        <Icons.fileText className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">No launch analysis available.</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Run an analysis to populate your Executive Dashboard with launch readiness, risk, and recommendation insights.
      </p>
      <button
        onClick={onCreateAnalysis}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Icons.plus className="w-4 h-4" />
        Create New Analysis
      </button>
    </div>
  );
}
