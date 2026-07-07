import { Router } from "express";
import { isGoogleDriveConfigured } from "../services/googleAuthService";
import { generatePdfReport, PdfReportData } from "../services/pdfGenerator";
import { uploadPdfToDrive } from "../services/googleDriveService";

export const driveRouter = Router();

driveRouter.get("/drive/status", (_req, res) => {
  res.json({ configured: isGoogleDriveConfigured() });
});

driveRouter.post("/drive/export", async (req, res) => {
  if (!isGoogleDriveConfigured()) {
    return res.status(503).json({ error: "Google Drive is not configured." });
  }

  const {
    productName,
    productType,
    analysisDate,
    score,
    riskLevel,
    recommendation,
    executiveSummary,
    risks,
    missingRequirements,
    aiRecommendations,
  } = req.body ?? {};

  if (typeof productName !== "string" || productName.trim().length === 0) {
    return res.status(400).json({ error: "productName is required." });
  }
  if (typeof score !== "number") {
    return res.status(400).json({ error: "score is required." });
  }

  const reportData: PdfReportData = {
    productName,
    productType: productType ?? "Not specified",
    analysisDate: analysisDate ?? new Date().toLocaleDateString(),
    score,
    riskLevel: riskLevel ?? "Unknown",
    recommendation: recommendation ?? "N/A",
    executiveSummary: executiveSummary ?? "",
    risks: Array.isArray(risks) ? risks : [],
    missingRequirements: Array.isArray(missingRequirements) ? missingRequirements : [],
    aiRecommendations: Array.isArray(aiRecommendations) ? aiRecommendations : [],
  };

  try {
    const pdfBuffer = await generatePdfReport(reportData);

    const safeName = productName
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_")
      .slice(0, 50);
    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `LaunchMind_${safeName}_${dateStr}.pdf`;

    const result = await uploadPdfToDrive(pdfBuffer, fileName);

    res.json({
      success: true,
      fileId: result.fileId,
      fileLink: result.fileLink,
    });
  } catch (err) {
    console.error("Drive export error:", err);
    const message =
      err instanceof Error ? err.message : "Export to Google Drive failed.";
    res.status(502).json({ error: message });
  }
});
