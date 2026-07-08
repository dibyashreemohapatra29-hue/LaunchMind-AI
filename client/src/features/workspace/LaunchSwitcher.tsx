import React from "react";
import { Launch } from "./WorkspaceTypes";

const decisionBadgeClasses: Record<Launch["decision"], string> = {
  GO: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "GO WITH RISKS": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "NO-GO": "bg-destructive/10 text-destructive border-destructive/20",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

interface LaunchSwitcherProps {
  launches: Launch[];
  selectedLaunchId: string | null;
  onSelect: (launchId: string) => void;
}

export function LaunchSwitcher({ launches, selectedLaunchId, onSelect }: LaunchSwitcherProps) {
  if (launches.length === 0) {
    return <p className="text-sm text-muted-foreground">No launches available yet.</p>;
  }

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-2" htmlFor="launch-switcher">
        Viewing Launch
      </label>
      <select
        id="launch-switcher"
        value={selectedLaunchId ?? ""}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {launches.map((launch) => (
          <option key={launch.launchId} value={launch.launchId}>
            {launch.productName} — {formatDate(launch.analysisDate)}
          </option>
        ))}
      </select>

      <div className="mt-3 flex flex-wrap gap-2">
        {launches.map((launch) => (
          <button
            key={launch.launchId}
            onClick={() => onSelect(launch.launchId)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              launch.launchId === selectedLaunchId
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            <span className="font-semibold">{launch.productName}</span>
            <span className={`ml-2 px-1.5 py-0.5 rounded-full border ${decisionBadgeClasses[launch.decision]}`}>
              {launch.decision}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
