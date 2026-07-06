import React from "react";
import { Icons } from "../icons";

interface QuickActionsProps {
  setCurrentView: (view: string) => void;
}

export function QuickActions({ setCurrentView }: QuickActionsProps) {
  const actions = [
    {
      title: "New Analysis",
      description: "Start a fresh PRD review",
      icon: Icons.plus,
      id: "new-analysis",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Upload PRD",
      description: "Drag & drop document",
      icon: Icons.upload,
      id: "new-analysis",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "View History",
      description: "Past launch decisions",
      icon: Icons.history,
      id: "history",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentView(action.id)}
            className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left group"
          >
            <div className={`p-3 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm mb-1">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
