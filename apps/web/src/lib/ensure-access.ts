import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@nexus/db";
import { ALL_PERMISSIONS } from "@/lib/team-permissions";

type AuthSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    [key: string]: any;
  };
} | null;

/**
 * Ensures the authenticated user has access to the given guild.
 * NEVER throws — always either returns session or redirects.
 *
 * Access logic:
 * 1. Must be logged in → redirect /login
 * 2. Active TeamMember record in DB → fast path, allow
 * 3. No record → verify via Discord API (ManageGuild/Admin)
 *    → yes: create owner record, allow
 *    → no: redirect /dashboard
 * 4. Any unexpected error → redirect /dashboard (never crash)
 */
export async function ensureServerAccess(guildId: string) {
  // ── Auth check ────────────────────────────────────────────────
  // Cast to any to avoid NextAuth v5 overload resolution picking NextMiddleware
  let session: AuthSession;
  try {
    session = (await (auth as any)()) as AuthSession;
  } catch {
    redirect("/login");
  }

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  try {
    // ── Fast path: active TeamMember in DB ─────────────────────
    const teamMember = await db.teamMember.findFirst({
      where: { guildId, userId, status: "active" },
      select: { role: true },
    });

    if (teamMember) {
      return session; // ✅ Verified — existing member
    }

    // ── Fallback: verify via Discord API ───────────────────────
    const accessToken = (session.user as any).accessToken;

    if (accessToken) {
      const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      if (discordRes.ok) {
        const guilds: { id: string; owner: boolean; permissions: string }[] =
          await discordRes.json();

        const MANAGE_GUILD = 0x20n;
        const ADMINISTRATOR = 0x8n;

        const hasAccess = guilds.some((g) => {
          if (g.id !== guildId) return false;
          const perms = BigInt(g.permissions);
          return (
            g.owner ||
            (perms & MANAGE_GUILD) === MANAGE_GUILD ||
            (perms & ADMINISTRATOR) === ADMINISTRATOR
          );
        });

        if (hasAccess) {
          // Ensure guild + user exist, create/reactivate owner record
          await db.guild.upsert({
            where: { discordId: guildId },
            update: {},
            create: { discordId: guildId, name: "Server" },
          });

          await db.user.upsert({
            where: { discordId: userId },
            update: {},
            create: {
              discordId: userId,
              username: session.user.name ?? "Unknown",
            },
          });

          await db.teamMember.upsert({
            where: { guildId_userId: { guildId, userId } },
            update: {
              status: "active",
              role: "owner",
              permissions: { permissions: ALL_PERMISSIONS },
            },
            create: {
              guildId,
              userId,
              role: "owner",
              status: "active",
              permissions: { permissions: ALL_PERMISSIONS },
            },
          });

          return session; // ✅ Verified via Discord — record created
        }
      }
    }
  } catch (err) {
    // Never crash a Server Component — log in dev, redirect in prod
    if (process.env.NODE_ENV === "development") {
      console.error("[ensureServerAccess] Unexpected error:", err);
    }
    redirect("/dashboard");
  }

  // No access found → redirect
  if (process.env.NODE_ENV === "development") {
    console.warn(`[ensureServerAccess] Access denied: user ${userId} → guild ${guildId}`);
  }
  redirect("/dashboard");
}
