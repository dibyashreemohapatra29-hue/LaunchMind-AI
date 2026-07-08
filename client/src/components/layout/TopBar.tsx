import React from "react";
import { Icons } from "../icons";

interface TopBarProps {
  currentView: string;
}

export function TopBar({ currentView }: TopBarProps) {
  const getTitle = () => {
    switch (currentView) {
      case "dashboard": return "Dashboard";
      case "executive-dashboard": return "Executive Dashboard";
      case "new-analysis": return "New Analysis";
      case "history": return "Analysis History";
      case "integrations": return "Integrations";
      case "settings": return "Settings";
      default: return "Dashboard";
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold capitalize">{getTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Icons.search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search PRDs or analyses..." 
            className="w-64 h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        
        <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Icons.bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
        </button>
      </div>
    </header>
  );
}
