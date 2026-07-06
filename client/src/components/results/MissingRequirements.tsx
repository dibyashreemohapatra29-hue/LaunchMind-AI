import React from "react";
import { Icons } from "../icons";
import { MissingRequirementItem, Priority } from "../../lib/resultsMapper";

const priorityBadgeClasses: Record<Priority, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Low: "bg-muted text-muted-foreground border-border",
};

interface MissingRequirementsProps {
  items: MissingRequirementItem[];
}

export function MissingRequirements({ items }: MissingRequirementsProps) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Missing Requirements</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30">
            <div className="w-5 h-5 rounded border border-input bg-background flex items-center justify-center shrink-0 mt-0.5">
              <Icons.alertTriangle className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityBadgeClasses[item.priority]}`}>
                  {item.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
