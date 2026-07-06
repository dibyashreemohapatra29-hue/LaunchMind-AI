import React from "react";
import { Icons } from "../icons";

interface ResultsActionsProps {
  onRunNewAnalysis: () => void;
  onReturnToDashboard: () => void;
}

export function ResultsActions({ onRunNewAnalysis, onReturnToDashboard }: ResultsActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
      <button
        // TODO: PDF Export integration — generate and download a PDF report of this analysis
        disabled
        title="Coming soon"
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium border border-border text-muted-foreground bg-muted/50 cursor-not-allowed"
      >
        <Icons.download className="w-4 h-4" />
        Download Report
      </button>

      <button
        onClick={onRunNewAnalysis}
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
      >
        Run New Analysis
      </button>

      <button
        onClick={onReturnToDashboard}
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Return to Dashboard
      </button>

      {/* Future integration placeholders — no functionality yet:
          - TODO: Supabase Storage — persist generated report/artifacts
          - TODO: Slack Sharing — share this analysis to a Slack channel
          - TODO: Google Drive Export — export report to Google Drive
          - TODO: Calendar Event Creation — schedule a launch review meeting */}
    </div>
  );
}
