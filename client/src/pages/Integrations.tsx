import React, { useEffect, useState } from "react";
import { Icons } from "../components/icons";
import { getSlackStatus, getDriveStatus } from "../lib/api";

interface IntegrationItem {
  name: string;
  desc: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  status: "connected" | "not-connected" | "coming-soon";
}

const statusBadge: Record<IntegrationItem["status"], { label: string; className: string }> = {
  connected: {
    label: "Connected",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  "not-connected": {
    label: "Not Connected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  "coming-soon": {
    label: "Coming Soon",
    className: "bg-secondary text-secondary-foreground border-border",
  },
};

export function Integrations() {
  const [slackConfigured, setSlackConfigured] = useState<boolean | null>(null);
  const [driveConfigured, setDriveConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    getSlackStatus()
      .then((s) => setSlackConfigured(s.configured))
      .catch(() => setSlackConfigured(false));
    getDriveStatus()
      .then((s) => setDriveConfigured(s.configured))
      .catch(() => setDriveConfigured(false));
  }, []);

  const integrations: IntegrationItem[] = [
    {
      name: "Gemini API",
      desc: "Core AI analysis engine powering PRD analysis and launch decisions.",
      icon: Icons.logo,
      status: "connected",
    },
    {
      name: "Slack",
      desc: "Send launch decisions and readiness reports to a Slack channel.",
      icon: Icons.slack,
      status:
        slackConfigured === null
          ? "coming-soon"
          : slackConfigured
          ? "connected"
          : "not-connected",
    },
    {
      name: "Google Drive",
      desc: "Export AI analysis reports as professional PDFs directly to Google Drive.",
      icon: Icons.fileText,
      status:
        driveConfigured === null
          ? "coming-soon"
          : driveConfigured
          ? "connected"
          : "not-connected",
    },
    {
      name: "Google Calendar",
      desc: "Schedule launch reviews and milestones automatically.",
      icon: Icons.calendar,
      status: "connected",
    },
    {
      name: "Gmail",
      desc: "Send AI analysis reports and launch summaries via email.",
      icon: Icons.fileText,
      status: "connected",
    },
  ];  

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Integrations</h2>
        <p className="text-muted-foreground">
          Connect LaunchMind AI with your existing tools and workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => {
          const badge = statusBadge[item.status];
          return (
            <div
              key={item.name}
              className="flex items-start p-6 bg-card border border-border rounded-xl shadow-sm"
            >
              <div className="bg-muted p-3 rounded-lg mr-4 flex-shrink-0">
                <item.icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{item.desc}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    item.status === "connected"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  }`}
                  disabled={item.status !== "connected"}
                >
                  {item.status === "connected" ? "Manage" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        To configure Slack, add a <code className="bg-muted px-1 py-0.5 rounded text-xs">SLACK_WEBHOOK_URL</code> secret in your Replit project settings.
        For Google Drive, add <code className="bg-muted px-1 py-0.5 rounded text-xs">GOOGLE_CLIENT_ID</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs">GOOGLE_CLIENT_SECRET</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs">GOOGLE_REFRESH_TOKEN</code>, and <code className="bg-muted px-1 py-0.5 rounded text-xs">GOOGLE_DRIVE_FOLDER_ID</code>.
      </p>
    </div>
  );
}
