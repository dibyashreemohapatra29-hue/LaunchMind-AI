import { Icons } from "../icons";

interface HeroSectionProps {
  onNewAnalysis: () => void;
}

export function HeroSection({ onNewAnalysis }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card border border-border p-8 mb-8 shadow-sm">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            AI Product Operations Command Center
          </h2>
          <p className="text-muted-foreground text-lg">
            Make evidence-based Go / No-Go launch decisions. Analyze PRDs for risk, readiness, and completeness.
          </p>
        </div>
        <button 
          onClick={onNewAnalysis}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Icons.plus className="w-4 h-4" />
          New Analysis
        </button>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-10 pointer-events-none">
        <Icons.logo className="w-64 h-64 text-primary" />
      </div>
    </div>
  );
}
