import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@nexus/db";
import { ALL_PERMISSIONS } from "@/lib/team-permissions";

/**
 * Ensures the authenticated user has access to the given guild.
 *
 * Access logic:
 * 1. Must be logged in
 * 2. If TeamMember record exists and is active → allow
 * 3. If no TeamMember record → verify via Discord API that user has ManageGuild/Admin
 *    → if yes, create them as owner and allow
 *    → if no, redirect to /dashboard
 */
export async function ensureServerAccess(guildId: string) {
  const session = await auth();

  // 1. Must be logged in
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 2. Check active TeamMember record (fast path — DB only)
  const teamMember = await db.teamMember.findFirst({
    where: { guildId, userId, status: "active" },
    select: { role: true },
  });

  if (teamMember) {
    return session; // ✅ Already a verified member
  }

  // 3. No TeamMember record — verify via Discord API
  // This handles: new guilds, users who never had a record, migration
  const accessToken = (session.user as any).accessToken;

  if (accessToken) {
    try {
      const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      if (discordRes.ok) {
        const guilds: { id: string; owner: boolean; permissions: string }[] = await discordRes.json();
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
          // Ensure guild exists in DB
          await db.guild.upsert({
            where: { discordId: guildId },
            update: {},
            create: { discordId: guildId, name: "Server" },
          });

          // Ensure user exists in DB
          await db.user.upsert({
            where: { discordId: userId },
            update: {},
            create: { discordId: userId, username: session.user.name ?? "Unknown" },
          });

          // Add/reactivate as owner with explicit permissions (not wildcard)
          await db.teamMember.upsert({
            where: { guildId_userId: { guildId, userId } },
            update: { status: "active", role: "owner", permissions: { permissions: ALL_PERMISSIONS } },
            create: {
              guildId,
              userId,
              role: "owner",
              status: "active",
              permissions: { permissions: ALL_PERMISSIONS },
            },
          });

          return session; // ✅ Verified via Discord, record created
        }
      }
    } catch (err) {
      // Discord API failed — fall through to redirect
      if (process.env.NODE_ENV === "development") {
        console.error("[ensureServerAccess] Discord API error:", err);
      }
    }
  }

  // 4. No access — redirect
  if (process.env.NODE_ENV === "development") {
    console.warn(`[ensureServerAccess] Access denied: user ${userId} → guild ${guildId}`);
  }
  redirect("/dashboard");
}
