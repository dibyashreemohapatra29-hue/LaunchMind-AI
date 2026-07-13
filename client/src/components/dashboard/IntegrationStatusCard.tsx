import React from "react";
import { Icons } from "../icons";
import { IntegrationStatusViewModel } from "../../services/DashboardService";

function StatusRow({ icon: Icon, label, connected, active, activeLabel, inactiveLabel }: {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  label: string;
  connected: boolean;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
          !connected
            ? "bg-muted text-muted-foreground border-border"
            : active
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
        }`}
      >
        {!connected ? "Not Connected" : active ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}

export function IntegrationStatusCard({ slackConnected, slackShared, driveConnected, reportExported }: IntegrationStatusViewModel) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Integration Status</h3>
      <StatusRow
        icon={Icons.download}
        label="Report Export"
        connected={driveConnected}
        active={reportExported}
        activeLabel="Exported"
        inactiveLabel="Not Exported"
      />
      <StatusRow
        icon={Icons.slack}
        label="Slack"
        connected={slackConnected}
        active={slackShared}
        activeLabel="Shared"
        inactiveLabel="Connected"
      />

      <StatusRow
        icon={Icons.calendar}
        label="Google Calendar"
        connected={true}
        active={true}
        activeLabel="Connected"
        inactiveLabel="Not Connected"
      />

      <StatusRow
        icon={Icons.fileText}
        label="Gmail"
        connected={true}
        active={true}
        activeLabel="Connected"
        inactiveLabel="Not Connected"
      />
    </section>
  );
}
