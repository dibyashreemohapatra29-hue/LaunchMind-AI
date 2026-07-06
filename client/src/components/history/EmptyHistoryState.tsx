import React from "react";
import { Icons } from "../icons";

interface EmptyHistoryStateProps {
  onCreateFirst: () => void;
}

export function EmptyHistoryState({ onCreateFirst }: EmptyHistoryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
      <div className="bg-muted/50 p-6 rounded-full mb-6">
        <Icons.history className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2">No analyses yet.</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Run your first PRD analysis to start building a history of launch readiness reports.
      </p>
      <button
        onClick={onCreateFirst}
        className="px-6 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Create First Analysis
      </button>
    </div>
  );
}
