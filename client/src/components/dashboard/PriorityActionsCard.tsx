import { Icons } from "../icons";
import { PriorityActionsViewModel } from "../../services/DashboardService";

function ListSection({ title, items, emptyText, tone }: { title: string; items: string[]; emptyText: string; tone: "default" | "destructive" }) {
  return (
    <div>
      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${tone === "destructive" ? "text-destructive" : "text-muted-foreground"}`}>
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-foreground flex items-start gap-2">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${tone === "destructive" ? "bg-destructive" : "bg-primary"}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PriorityActionsCard({ priorityActions, blockers, nextSteps }: PriorityActionsViewModel) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <Icons.fileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Action Center
          </h3>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Recommended actions generated from the latest launch readiness analysis.
        </p>
      </div>

      <ListSection title="Priority Actions" items={priorityActions} emptyText="No priority actions identified." tone="default" />
      <ListSection title="Critical Blockers" items={blockers} emptyText="No critical blockers identified." tone="destructive" />
      <ListSection title="Next Steps" items={nextSteps} emptyText="No further next steps identified." tone="default" />
    </section>
  );
}
