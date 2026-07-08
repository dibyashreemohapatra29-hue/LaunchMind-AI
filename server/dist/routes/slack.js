"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackRouter = void 0;
const express_1 = require("express");
const slackService_1 = require("../services/slackService");
exports.slackRouter = (0, express_1.Router)();
exports.slackRouter.get("/slack/status", (_req, res) => {
    res.json({ configured: (0, slackService_1.isSlackConfigured)() });
});
exports.slackRouter.post("/slack/send", async (req, res) => {
    if (!(0, slackService_1.isSlackConfigured)()) {
        return res.status(503).json({ error: "Slack is not configured." });
    }
    const { productName, score, recommendation, summary, topRisks } = req.body ?? {};
    if (typeof productName !== "string" || productName.trim().length === 0) {
        return res.status(400).json({ error: "productName is required." });
    }
    if (typeof score !== "number") {
        return res.status(400).json({ error: "score is required." });
    }
    try {
        await (0, slackService_1.sendToSlack)({
            productName,
            score,
            recommendation: recommendation ?? "N/A",
            summary: summary ?? "",
            topRisks: Array.isArray(topRisks) ? topRisks : [],
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Slack send error:", err);
        const message = err instanceof Error ? err.message : "Unable to send message.";
        res.status(502).json({ error: message });
    }
});
