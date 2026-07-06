import React, { useEffect } from "react";
import { Icons } from "../icons";

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, onDismiss, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-card border border-border shadow-lg rounded-lg px-4 py-3 max-w-sm">
        <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <Icons.checkCircle className="w-4 h-4 text-emerald-600" />
        </div>
        <p className="text-sm text-foreground">{message}</p>
        <button
          onClick={onDismiss}
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
