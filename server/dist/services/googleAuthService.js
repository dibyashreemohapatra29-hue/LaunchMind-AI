"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGoogleDriveConfigured = isGoogleDriveConfigured;
exports.getGoogleAccessToken = getGoogleAccessToken;
function isGoogleDriveConfigured() {
    const required = [
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_REFRESH_TOKEN",
        "GOOGLE_DRIVE_FOLDER_ID",
    ];
    return required.every((key) => typeof process.env[key] === "string" &&
        process.env[key].trim().length > 0);
}
async function getGoogleAccessToken() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Google credentials are not configured.");
    }
    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
    });
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });
    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Google authentication failed. Check your credentials. (${response.status}: ${body})`);
    }
    const data = (await response.json());
    return data.access_token;
}
