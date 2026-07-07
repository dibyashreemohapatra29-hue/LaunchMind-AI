import { getGoogleAccessToken } from "./googleAuthService";

export interface DriveUploadResult {
  fileId: string;
  fileLink: string;
}

export async function uploadPdfToDrive(
  pdfBuffer: Buffer,
  fileName: string
): Promise<DriveUploadResult> {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not configured.");
  }

  const accessToken = await getGoogleAccessToken();

  const metadata = JSON.stringify({
    name: fileName,
    mimeType: "application/pdf",
    parents: [folderId],
  });

  const boundary = "launchmind_pdf_boundary";
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`
    ),
    pdfBuffer,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": body.length.toString(),
      },
      body,
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    if (response.status === 401 || response.status === 403) {
      throw new Error("Google authentication failed. Check your credentials.");
    }
    if (response.status === 404) {
      throw new Error("Google Drive folder not found. Check GOOGLE_DRIVE_FOLDER_ID.");
    }
    throw new Error(`Upload failed. (${response.status}: ${text})`);
  }

  const data = (await response.json()) as { id: string; webViewLink: string };

  return {
    fileId: data.id,
    fileLink: data.webViewLink,
  };
}

// TODO: Folder Picker — let users browse and select a target Drive folder.
// TODO: Shared Drives — support uploading to Google Workspace shared drives.
// TODO: Team Workspaces — associate uploads with a workspace/team Drive.
// TODO: Multiple Export Formats — support DOCX, XLSX alongside PDF.
// TODO: Version History — track multiple exports of the same analysis.
// TODO: Automatic Report Sync — push updated analyses automatically.
// TODO: Scheduled Exports — allow time-based automatic report exports.
