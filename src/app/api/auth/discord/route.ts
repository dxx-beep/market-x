import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET(request: Request) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) return NextResponse.redirect(new URL("/login?error=Discord%20OAuth%20не%20налаштований", request.url));
  const state = randomBytes(24).toString("hex");
  const redirectUri = process.env.DISCORD_REDIRECT_URI || new URL("/api/auth/discord/callback", request.url).toString();
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "identify email");
  url.searchParams.set("state", state);
  const response = NextResponse.redirect(url);
  response.cookies.set("discord_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
  return response;
}
