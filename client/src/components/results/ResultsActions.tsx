import { Icons } from "../icons";
import { GoogleDriveExportButton, DriveStatus } from "./GoogleDriveExportButton";

type SlackStatus = "idle" | "loading" | "success" | "error";

interface ResultsActionsProps {
  onRunNewAnalysis: () => void;
  onReturnToDashboard: () => void;
  onShareToSlack?: () => void;
  slackStatus?: SlackStatus;
  slackError?: string | null;
  onExportToDrive?: () => void;
  driveStatus?: DriveStatus;
  driveError?: string | null;
}

const slackButtonContent: Record<SlackStatus, { label: string; className: string }> = {
  idle: {
    label: "Share to Slack",
    className:
      "border border-border text-foreground hover:bg-muted transition-colors",
  },
  loading: {
    label: "Sending...",
    className: "border border-border text-muted-foreground bg-muted/50 cursor-not-allowed",
  },
  success: {
    label: "Sent to Slack",
    className: "border border-emerald-500/30 text-emerald-600 bg-emerald-500/10 cursor-default",
  },
  error: {
    label: "Share to Slack",
    className: "border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors",
  },
};

export function ResultsActions({
  onRunNewAnalysis,
  onReturnToDashboard,
  onShareToSlack,
  slackStatus = "idle",
  slackError = null,
  onExportToDrive,
  driveStatus = "idle",
  driveError = null,
}: ResultsActionsProps) {
  const slack = slackButtonContent[slackStatus];
  const slackDisabled = slackStatus === "loading" || slackStatus === "success";
  const anyUploading = driveStatus === "uploading";

  return (
    <div className="space-y-3 pt-2">
      {slackError && (
        <p className="text-sm text-destructive text-right">{slackError}</p>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 flex-wrap">
        {onExportToDrive && (
          <GoogleDriveExportButton
            status={driveStatus}
            error={driveError}
            onClick={onExportToDrive}
          />
        )}

        {onShareToSlack && (
          <button
            onClick={slackDisabled || anyUploading ? undefined : onShareToSlack}
            disabled={slackDisabled || anyUploading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium ${slack.className}`}
          >
            <Icons.slack className="w-4 h-4" />
            {slack.label}
          </button>
        )}

        <button
          onClick={anyUploading ? undefined : onRunNewAnalysis}
          disabled={anyUploading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Run New Analysis
        </button>

        <button
          onClick={anyUploading ? undefined : onReturnToDashboard}
          disabled={anyUploading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Return to Dashboard
        </button>

        {/* Future integration placeholders — no functionality yet:
            - TODO: Supabase Storage — persist generated report/artifacts
            - TODO: Slack OAuth — post to any workspace, not just webhook
            - TODO: Google Calendar Event Creation — schedule a launch review meeting */}
      </div>
    </div>
  );
}
