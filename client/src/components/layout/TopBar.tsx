import { useState } from "react";
import { Icons } from "../icons";

interface TopBarProps {
  currentView: string;
  onMenuClick?: () => void;
}

export function TopBar({ currentView, onMenuClick }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const getTitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Dashboard";
      case "executive-dashboard":
        return "Executive Dashboard";
      case "new-analysis":
        return "New Analysis";
      case "history":
        return "Analysis History";
      case "workspace":
        return "Workspace";
      case "integrations":
        return "Integrations";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="md:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
        >
          <Icons.menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold capitalize truncate">
          {getTitle()}
        </h1>
      </div>

      <div className="relative flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <label
            htmlFor="global-search"
            className="sr-only"
          >
            Search PRDs or analyses
          </label>

          <Icons.search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

          <input
            id="global-search"
            name="global-search"
            type="text"
            placeholder="Search PRDs or analyses..."
            aria-label="Search PRDs or analyses"
            className="w-64 h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
          className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
        >
          <Icons.bell className="w-5 h-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
          )}
        </button>

        {showNotifications && (
      <div className="absolute top-14 right-0 w-[380px] max-h-[70vh] rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0">
              <h3 className="font-semibold text-base">Notifications</h3>

              <button
                onClick={() => setHasUnreadNotifications(false)}
                className="text-xs text-primary hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">AI Analysis Completed</p>

                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      PRD analysis finished successfully.
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                    2 min ago
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Launch Score Updated</p>

                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      Readiness score recalculated successfully.
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                    8 min ago
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">GitHub Sync Complete</p>

                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      Repository synchronized successfully.
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                    25 min ago
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      Calendar Event Created
                    </p>

                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      Launch meeting scheduled successfully.
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                    1 hour ago
                  </span>
                </div>
              </div>

                <div className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        Slack Notification Sent
                      </p>

                      <p className="text-sm text-muted-foreground mt-1 break-words">
                        Product team has been notified.
                      </p>
                    </div>

                    <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                      Yesterday
                    </span>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
