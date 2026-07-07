import { Router } from "express";
import { isSlackConfigured, sendToSlack } from "../services/slackService";

export const slackRouter = Router();

slackRouter.get("/slack/status", (_req, res) => {
  res.json({ configured: isSlackConfigured() });
});

slackRouter.post("/slack/send", async (req, res) => {
  if (!isSlackConfigured()) {
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
    await sendToSlack({
      productName,
      score,
      recommendation: recommendation ?? "N/A",
      summary: summary ?? "",
      topRisks: Array.isArray(topRisks) ? topRisks : [],
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Slack send error:", err);
    const message =
      err instanceof Error ? err.message : "Unable to send message.";
    res.status(502).json({ error: message });
  }
});
