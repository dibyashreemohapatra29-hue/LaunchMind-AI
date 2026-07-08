import { Icons } from "../icons";

export type DriveStatus = "idle" | "uploading" | "saved" | "error";

interface GoogleDriveExportButtonProps {
  status: DriveStatus;
  error?: string | null;
  onClick: () => void;
}

const buttonContent: Record<DriveStatus, { label: string; className: string }> = {
  idle: {
    label: "Export to Google Drive",
    className: "border border-border text-foreground hover:bg-muted transition-colors",
  },
  uploading: {
    label: "Uploading...",
    className: "border border-border text-muted-foreground bg-muted/50 cursor-not-allowed",
  },
  saved: {
    label: "Saved to Drive",
    className: "border border-emerald-500/30 text-emerald-600 bg-emerald-500/10 cursor-default",
  },
  error: {
    label: "Export to Google Drive",
    className: "border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors",
  },
};

export function GoogleDriveExportButton({
  status,
  error,
  onClick,
}: GoogleDriveExportButtonProps) {
  const btn = buttonContent[status];
  const disabled = status === "uploading" || status === "saved";

  return (
    <div className="flex flex-col items-end gap-1">
      {error && (
        <p className="text-sm text-destructive text-right">{error}</p>
      )}
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium ${btn.className}`}
      >
        <Icons.externalLink className="w-4 h-4" />
        {btn.label}
      </button>
    </div>
  );
}
