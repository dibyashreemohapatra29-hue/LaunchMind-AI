interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export function isGoogleDriveConfigured(): boolean {
  const required = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_DRIVE_FOLDER_ID",
  ];
  return required.every(
    (key) =>
      typeof process.env[key] === "string" &&
      (process.env[key] as string).trim().length > 0
  );
}

export async function getGoogleAccessToken(): Promise<string> {
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
    throw new Error(
      `Google authentication failed. Check your credentials. (${response.status}: ${body})`
    );
  }

  const data = (await response.json()) as TokenResponse;
  return data.access_token;
}
