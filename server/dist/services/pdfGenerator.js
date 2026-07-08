"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfReport = generatePdfReport;
const pdfkit_1 = __importDefault(require("pdfkit"));
const COLORS = {
    primary: "#6366f1",
    text: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
    go: "#16a34a",
    goWithRisks: "#d97706",
    noGo: "#dc2626",
    high: "#dc2626",
    medium: "#d97706",
    low: "#16a34a",
    critical: "#7c3aed",
};
function severityColor(severity) {
    const s = severity.toLowerCase();
    if (s === "high" || s === "critical")
        return COLORS.high;
    if (s === "medium")
        return COLORS.medium;
    return COLORS.low;
}
function recommendationColor(rec) {
    const r = rec.toUpperCase();
    if (r === "GO")
        return COLORS.go;
    if (r === "NO-GO")
        return COLORS.noGo;
    return COLORS.goWithRisks;
}
function generatePdfReport(data) {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({ margin: 50, size: "A4" });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        const pageWidth = doc.page.width - 100;
        // ── Header ──────────────────────────────────────────────────────────────
        doc.rect(0, 0, doc.page.width, 80).fill(COLORS.primary);
        doc
            .fillColor("#ffffff")
            .fontSize(22)
            .font("Helvetica-Bold")
            .text("LaunchMind AI", 50, 22);
        doc.fontSize(10).font("Helvetica").text("AI-Powered Launch Readiness Report", 50, 50);
        doc.fillColor(COLORS.text).moveDown(0);
        doc.y = 100;
        // ── Product Info ─────────────────────────────────────────────────────────
        doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.text).text("Product Details", 50, doc.y);
        doc.moveTo(50, doc.y + 2).lineTo(50 + pageWidth, doc.y + 2).strokeColor(COLORS.border).stroke();
        doc.moveDown(0.5);
        const infoItems = [
            ["Product Name", data.productName],
            ["Product Type", data.productType],
            ["Analysis Date", data.analysisDate],
        ];
        for (const [label, value] of infoItems) {
            doc.fontSize(9).font("Helvetica-Bold").fillColor(COLORS.muted).text(label.toUpperCase(), 50, doc.y, { continued: false });
            doc.fontSize(10).font("Helvetica").fillColor(COLORS.text).text(value, 50, doc.y);
            doc.moveDown(0.3);
        }
        doc.moveDown(0.5);
        // ── Score + Recommendation ───────────────────────────────────────────────
        doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.text).text("Launch Readiness Score", 50, doc.y);
        doc.moveTo(50, doc.y + 2).lineTo(50 + pageWidth, doc.y + 2).strokeColor(COLORS.border).stroke();
        doc.moveDown(0.5);
        doc
            .fontSize(36)
            .font("Helvetica-Bold")
            .fillColor(COLORS.primary)
            .text(`${data.score}/100`, 50, doc.y, { continued: false });
        doc.moveDown(0.3);
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(COLORS.muted)
            .text(`Risk Level: ${data.riskLevel}`, 50, doc.y);
        doc.moveDown(0.5);
        doc.fontSize(10).font("Helvetica-Bold").fillColor(COLORS.muted).text("RECOMMENDATION", 50, doc.y);
        doc.moveDown(0.2);
        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .fillColor(recommendationColor(data.recommendation))
            .text(data.recommendation, 50, doc.y);
        doc.moveDown(0.8);
        // ── Executive Summary ────────────────────────────────────────────────────
        doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.text).text("Executive Summary", 50, doc.y);
        doc.moveTo(50, doc.y + 2).lineTo(50 + pageWidth, doc.y + 2).strokeColor(COLORS.border).stroke();
        doc.moveDown(0.4);
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(COLORS.text)
            .text(data.executiveSummary, 50, doc.y, { width: pageWidth, align: "justify" });
        doc.moveDown(1);
        // ── Risk Assessment ──────────────────────────────────────────────────────
        if (doc.y > 650)
            doc.addPage();
        doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.text).text("Risk Assessment", 50, doc.y);
        doc.moveTo(50, doc.y + 2).lineTo(50 + pageWidth, doc.y + 2).strokeColor(COLORS.border).stroke();
        doc.moveDown(0.5);
        for (const risk of data.risks.slice(0, 8)) {
            if (doc.y > 700)
                doc.addPage();
            const dotColor = severityColor(risk.severity);
            doc.circle(58, doc.y + 5, 4).fill(dotColor);
            doc
                .fontSize(10)
                .font("Helvetica-Bold")
                .fillColor(COLORS.text)
                .text(risk.risk, 68, doc.y, { width: pageWidth - 18 });
            doc
                .fontSize(9)
                .font("Helvetica")
                .fillColor(COLORS.muted)
                .text(`Severity: ${risk.severity}   |   ${risk.impact}`, 68, doc.y, { width: pageWidth - 18 });
            doc.moveDown(0.6);
        }
        doc.moveDown(0.5);
        // ── Missing Requirements ─────────────────────────────────────────────────
        if (data.missingRequirements.length > 0) {
            if (doc.y > 650)
                doc.addPage();
            doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.text).text("Missing Requirements", 50, doc.y);
            doc.moveTo(50, doc.y + 2).lineTo(50 + pageWidth, doc.y + 2).strokeColor(COLORS.border).stroke();
            doc.moveDown(0.5);
            for (const req of data.missingRequirements.slice(0, 8)) {
                if (doc.y > 700)
                    doc.addPage();
                doc
                    .fontSize(10)
                    .font("Helvetica-Bold")
                    .fillColor(COLORS.text)
                    .text(`${req.title}`, 50, doc.y, { continued: true })
                    .fontSize(9)
                    .font("Helvetica")
                    .fillColor(severityColor(req.priority))
                    .text(`  [${req.priority}]`, { width: pageWidth });
                doc
                    .fontSize(9)
                    .font("Helvetica")
                    .fillColor(COLORS.muted)
                    .text(req.description, 50, doc.y, { width: pageWidth });
                doc.moveDown(0.6);
            }
            doc.moveDown(0.5);
        }
        // ── AI Recommendations ───────────────────────────────────────────────────
        if (data.aiRecommendations.length > 0) {
            if (doc.y > 650)
                doc.addPage();
            doc.fontSize(11).font("Helvetica-Bold").fillColor(COLORS.text).text("AI Recommendations", 50, doc.y);
            doc.moveTo(50, doc.y + 2).lineTo(50 + pageWidth, doc.y + 2).strokeColor(COLORS.border).stroke();
            doc.moveDown(0.5);
            data.aiRecommendations.forEach((rec, i) => {
                if (doc.y > 700)
                    doc.addPage();
                doc
                    .fontSize(10)
                    .font("Helvetica")
                    .fillColor(COLORS.text)
                    .text(`${i + 1}.  ${rec}`, 50, doc.y, { width: pageWidth });
                doc.moveDown(0.5);
            });
        }
        // ── Footer ───────────────────────────────────────────────────────────────
        const footerY = doc.page.height - 40;
        doc
            .fontSize(8)
            .font("Helvetica")
            .fillColor(COLORS.muted)
            .text(`Generated by LaunchMind AI · ${data.analysisDate}`, 50, footerY, { width: pageWidth, align: "center" });
        doc.end();
    });
}
