import React from "react";
import { ScoreCardData } from "../../lib/resultsMapper";

const riskBadgeClasses: Record<ScoreCardData["riskLevel"], string> = {
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  High: "bg-destructive/10 text-destructive border-destructive/20",
};

const progressBarClasses: Record<ScoreCardData["riskLevel"], string> = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-500",
  High: "bg-destructive",
};

export function ScoreCard({ score, riskLevel }: ScoreCardData) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">Launch Readiness Score</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskBadgeClasses[riskLevel]}`}>
          {riskLevel} Risk
        </span>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-5xl font-bold text-foreground">{clampedScore}</span>
        <span className="text-lg text-muted-foreground mb-1">/100</span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${progressBarClasses[riskLevel]}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </section>
  );
}
