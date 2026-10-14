import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@nexus/db";

/**
 * Ensures the authenticated user has active team membership for the given guild.
 * Throws / redirects on any violation.
 *
 * SECURITY: Replaces the old broken implementation that only checked login status.
 * Now verifies the user is an active TeamMember of the guild before granting access.
 */
export async function ensureServerAccess(guildId: string) {
  const session = await auth();

  // 1. Must be logged in
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 2. Guild must exist in DB
  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: { discordId: true },
  });

  if (!guild) {
    // Guild not in our DB at all — check if the user actually has access
    // by verifying they are on the server via Discord API before creating
    const accessToken = (session.user as any).accessToken;
    if (accessToken) {
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
          return g.owner || (perms & MANAGE_GUILD) === MANAGE_GUILD || (perms & ADMINISTRATOR) === ADMINISTRATOR;
        });
        if (!hasAccess) {
          redirect("/dashboard");
        }
        // User really does manage this guild — create it and add them as owner
        await db.guild.create({ data: { discordId: guildId, name: "Server" } });
        await db.teamMember.create({
          data: {
            guildId,
            userId,
            role: "owner",
            status: "active",
            permissions: { permissions: ["*"] },
          },
        });
        return session;
      }
    }
    redirect("/dashboard");
  }

  // 3. User must be an active team member of this guild
  const teamMember = await db.teamMember.findFirst({
    where: {
      guildId,
      userId,
      status: "active",
    },
    select: { role: true },
  });

  if (!teamMember) {
    // Not a member — log attempt and redirect
    if (process.env.NODE_ENV === "development") {
      console.warn(`[ensureServerAccess] IDOR attempt: user ${userId} tried to access guild ${guildId}`);
    }
    redirect("/dashboard");
  }

  return session;
}
