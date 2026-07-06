import React from "react";
import { Icons } from "../components/icons";

export function Integrations() {
  const integrations = [
    { name: "Gemini API", desc: "Core AI analysis engine", status: "Coming Soon", icon: Icons.logo },
    { name: "Slack", desc: "Send launch decisions to channels", status: "Coming Soon", icon: Icons.slack },
    { name: "Google Drive", desc: "Import PRDs directly", status: "Coming Soon", icon: Icons.fileText },
    { name: "Google Calendar", desc: "Schedule launch reviews automatically", status: "Coming Soon", icon: Icons.calendar },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Integrations</h2>
        <p className="text-muted-foreground">Connect LaunchMind AI with your existing tools. (Mock UI - Features in development)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int, i) => (
          <div key={i} className="flex items-start p-6 bg-card border border-border rounded-xl shadow-sm">
            <div className="bg-muted p-3 rounded-lg mr-4">
              <int.icon className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{int.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{int.desc}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                {int.status}
              </span>
            </div>
            <div>
              <button disabled className="text-sm font-medium px-4 py-2 bg-muted text-muted-foreground rounded-md opacity-50 cursor-not-allowed">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
