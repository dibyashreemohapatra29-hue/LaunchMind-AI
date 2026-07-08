import { TimelineEvent } from "./WorkspaceTypes";

function formatTimestamp(iso: string | null): string {
  if (!iso) return "Not yet recorded";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

interface TimelinePanelProps {
  events: TimelineEvent[];
}

export function TimelinePanel({ events }: TimelinePanelProps) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No timeline events yet.</p>;
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
      <div className="space-y-5">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <span
              className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-background ${
                event.status === "completed" ? "bg-emerald-500" : "bg-muted-foreground/40"
              }`}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-sm font-semibold text-foreground">{event.label}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">{formatTimestamp(event.timestamp)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
