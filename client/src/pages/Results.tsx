import React from "react";
import { AnalysisResult } from "../lib/api";
import { Icons } from "../components/icons";

interface ResultsProps {
  result: AnalysisResult | null;
  setCurrentView: (view: string) => void;
}

const severityColor: Record<string, string> = {
  high: "text-destructive bg-destructive/10 border-destructive/20",
  medium: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  low: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
};

export function Results({ result, setCurrentView }: ResultsProps) {
  if (!result) {
    return (
      <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-muted/50 p-6 rounded-full mb-6">
          <Icons.externalLink className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">No Analysis Available</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Run a new analysis to see results here.
        </p>
        <button
          onClick={() => setCurrentView("new-analysis")}
          className="px-6 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start New Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-12 space-y-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
          Analysis Results
        </h2>
        <p className="text-muted-foreground">
          AI-generated launch readiness analysis for your PRD.
        </p>
      </div>

      {result.launchReadinessScore !== undefined && (
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Launch Readiness Score</h3>
          <p className="text-4xl font-bold text-foreground">{result.launchReadinessScore}<span className="text-lg text-muted-foreground">/100</span></p>
        </section>
      )}

      {result.executiveSummary && (
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Executive Summary</h3>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{result.executiveSummary}</p>
        </section>
      )}

      {result.goNoGoRecommendation && (
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Go / No-Go Recommendation</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3 ${
            result.goNoGoRecommendation.decision === "go"
              ? "bg-emerald-500/10 text-emerald-600"
              : result.goNoGoRecommendation.decision === "no-go"
              ? "bg-destructive/10 text-destructive"
              : "bg-amber-500/10 text-amber-600"
          }`}>
            {result.goNoGoRecommendation.decision}
          </span>
          <p className="text-sm text-foreground leading-relaxed">{result.goNoGoRecommendation.rationale}</p>
        </section>
      )}

      {result.risks && result.risks.length > 0 && (
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Risk Assessment</h3>
          <div className="space-y-3">
            {result.risks.map((risk, i) => (
              <div key={i} className={`border rounded-lg p-4 ${severityColor[risk.severity] || ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{risk.title}</p>
                  <span className="text-xs uppercase font-semibold">{risk.severity}</span>
                </div>
                <p className="text-sm opacity-90">{risk.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {result.missingRequirements && result.missingRequirements.length > 0 && (
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Missing Requirements</h3>
          <ul className="space-y-2">
            {result.missingRequirements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Icons.externalLink className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentView("new-analysis")}
          className="px-6 py-2.5 rounded-md text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
        >
          Run Another Analysis
        </button>
      </div>
    </div>
  );
}
