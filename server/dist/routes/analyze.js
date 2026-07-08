"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRouter = void 0;
const express_1 = require("express");
const geminiService_1 = require("../services/geminiService");
exports.analyzeRouter = (0, express_1.Router)();
exports.analyzeRouter.post("/analyze", async (req, res) => {
    const { productName, productType, prdText, options } = req.body ?? {};
    if (typeof productName !== "string" || productName.trim().length === 0) {
        return res.status(400).json({ error: "productName is required." });
    }
    if (typeof productType !== "string" || productType.trim().length === 0) {
        return res.status(400).json({ error: "productType is required." });
    }
    if (typeof prdText !== "string" || prdText.trim().length === 0) {
        return res.status(400).json({ error: "prdText is required." });
    }
    const defaultOptions = {
        riskAssessment: true,
        launchReadinessScore: true,
        missingRequirements: true,
        executiveSummary: true,
        goNoGoRecommendation: true,
    };
    try {
        const result = await (0, geminiService_1.analyzePrd)({
            productName,
            productType,
            prdText,
            options: { ...defaultOptions, ...options },
        });
        res.json({ result });
    }
    catch (err) {
        console.error("Error analyzing PRD:", err);
        const message = err instanceof Error ? err.message : "Failed to analyze PRD.";
        res.status(502).json({ error: message });
    }
});
