import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

type DiscordUser = { id: string; username: string; global_name?: string; email?: string; verified?: boolean; avatar?: string | null };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = (await cookies()).get("discord_oauth_state")?.value;
  if (!code || !state || !stateCookie || state !== stateCookie) return NextResponse.redirect(new URL("/login?error=Невалідний%20OAuth%20запит", request.url));
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || new URL("/api/auth/discord/callback", request.url).toString();
  if (!clientId || !clientSecret) return NextResponse.redirect(new URL("/login?error=Discord%20OAuth%20не%20налаштований", request.url));
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "authorization_code", code, redirect_uri: redirectUri }) });
  if (!tokenResponse.ok) return NextResponse.redirect(new URL("/login?error=Не%20вдалося%20підтвердити%20Discord", request.url));
  const token = await tokenResponse.json() as { access_token: string };
  const discordResponse = await fetch("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${token.access_token}` } });
  if (!discordResponse.ok) return NextResponse.redirect(new URL("/login?error=Не%20вдалося%20отримати%20профіль%20Discord", request.url));
  const profile = await discordResponse.json() as DiscordUser;
  const email = profile.email?.toLowerCase() || `discord_${profile.id}@oauth.marketx.local`;
  let user = await db.user.findFirst({ where: { OR: [{ email }, { username: `discord_${profile.id}` }] } });
  const avatarUrl = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=128` : null;
  console.log("Discord Profile Data:", {
    id: profile.id,
    username: profile.username,
    global_name: profile.global_name,
    email: profile.email,
  });

  const cleanGlobal = profile.global_name ? profile.global_name.replace(/[^\p{L}\p{N}_\s.-]/gu, "").trim().slice(0, 32) : "";
  const cleanUsername = profile.username ? profile.username.replace(/[^\p{L}\p{N}_\s.-]/gu, "").trim().slice(0, 32) : "";
  const candidateUsername = cleanGlobal || cleanUsername || profile.global_name || profile.username || `user_${profile.id.slice(-6)}`;

  let targetUsername = candidateUsername;
  const existingOther = await db.user.findFirst({
    where: { username: targetUsername, ...(user ? { NOT: { id: user.id } } : {}) }
  });
  if (existingOther) {
    targetUsername = `${candidateUsername}_${profile.id.slice(-4)}`;
  }

  if (!user) {
    user = await db.user.create({ data: { username: targetUsername, email, avatarUrl, passwordHash: `DISCORD:${profile.id}` } });
  } else {
    user = await db.user.update({
      where: { id: user.id },
      data: {
        avatarUrl,
        username: targetUsername,
      }
    });
  }
  await createSession(user.id);
  const response = NextResponse.redirect(new URL(user.onboardingDone ? "/dashboard" : "/onboarding", request.url));
  response.cookies.delete("discord_oauth_state");
  return response;
}
