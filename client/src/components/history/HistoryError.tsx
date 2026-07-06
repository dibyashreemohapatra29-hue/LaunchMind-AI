import React from "react";
import { Icons } from "../icons";

interface HistoryErrorProps {
  message: string;
  onRetry: () => void;
  onReturnToDashboard: () => void;
}

export function HistoryError({ message, onRetry, onReturnToDashboard }: HistoryErrorProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
        <Icons.alertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Couldn't Load History</h3>
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* No retry logic implemented yet — button simply re-triggers the initial fetch */}
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
        <button
          onClick={onReturnToDashboard}
          className="px-6 py-2.5 rounded-md text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
