"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSlackConfigured = isSlackConfigured;
exports.sendToSlack = sendToSlack;
function isSlackConfigured() {
    const url = process.env.SLACK_WEBHOOK_URL;
    return typeof url === "string" && url.trim().length > 0;
}
async function sendToSlack(payload) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
        throw new Error("Slack is not configured.");
    }
    const riskLines = payload.topRisks
        .slice(0, 5)
        .map((r) => `• ${r.risk} _(${r.severity})_`)
        .join("\n");
    const message = {
        text: `LaunchMind AI — Launch Decision: ${payload.productName} — ${payload.recommendation}`,
        blocks: [
            {
                type: "header",
                text: { type: "plain_text", text: "LaunchMind AI — Launch Decision", emoji: false },
            },
            {
                type: "section",
                fields: [
                    { type: "mrkdwn", text: `*Product*\n${payload.productName}` },
                    { type: "mrkdwn", text: `*Readiness Score*\n${payload.score}/100` },
                    { type: "mrkdwn", text: `*Recommendation*\n${payload.recommendation}` },
                ],
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Executive Summary*\n${payload.summary}`,
                },
            },
            ...(riskLines
                ? [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*Top Risks*\n${riskLines}`,
                        },
                    },
                ]
                : []),
            {
                type: "divider",
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `Shared via LaunchMind AI · ${new Date().toLocaleDateString()}`,
                    },
                ],
            },
        ],
    };
    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "Slack webhook request failed.");
    }
}
// TODO: Slack OAuth — replace static webhook with per-user OAuth tokens so
// users can authorize LaunchMind AI directly from their Slack workspace.
// TODO: Multiple Workspaces — store a webhook per team workspace to support
// sending to different organizations.
// TODO: Channel Selection — let users pick which Slack channel to post to
// instead of using the webhook's default channel.
// TODO: Thread Replies — post follow-up messages as replies in a thread
// to keep channels tidy when multiple analyses are shared.
