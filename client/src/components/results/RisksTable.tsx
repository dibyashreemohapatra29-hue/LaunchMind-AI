import React from "react";
import { RiskRow, Severity } from "../../lib/resultsMapper";

const severityBadgeClasses: Record<Severity, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

interface RisksTableProps {
  risks: RiskRow[];
}

export function RisksTable({ risks }: RisksTableProps) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Risk Assessment</h3>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-2 font-medium text-muted-foreground">Risk</th>
              <th className="px-6 py-2 font-medium text-muted-foreground">Severity</th>
              <th className="px-6 py-2 font-medium text-muted-foreground">Impact</th>
              <th className="px-6 py-2 font-medium text-muted-foreground">Suggested Action</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 align-top">
                <td className="px-6 py-3 font-medium text-foreground whitespace-normal">{row.risk}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${severityBadgeClasses[row.severity]}`}>
                    {row.severity}
                  </span>
                </td>
                <td className="px-6 py-3 text-muted-foreground whitespace-normal">{row.impact}</td>
                <td className="px-6 py-3 text-muted-foreground whitespace-normal">{row.suggestedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
