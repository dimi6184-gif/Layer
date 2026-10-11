import { auth } from "@/auth";
import { ensureTeamMember } from "@/actions/team";
import { redirect } from "next/navigation";
import { db } from "@nexus/db";

export async function ensureServerAccess(guildId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Production: Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log("[ensureServerAccess] Guild ID:", guildId);
    console.log("[ensureServerAccess] User:", session.user.id, session.user.name);
  }

  // Make sure the guild exists in database
  let guild = await db.guild.findUnique({
    where: { discordId: guildId },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log("[ensureServerAccess] Guild exists:", !!guild);
  }

  // If guild doesn't exist, create it
  if (!guild) {
    guild = await db.guild.create({
      data: {
        discordId: guildId,
        name: "Server", // Will be updated later
      },
    });
    if (process.env.NODE_ENV === 'development') {
      console.log("[ensureServerAccess] Created guild");
    }
  }

  // Ensure user is a team member (auto-add as owner if first user)
  const teamMember = await ensureTeamMember(guildId, session.user.id ?? '', session.user.name || "Unknown");
  if (process.env.NODE_ENV === 'development') {
    console.log("[ensureServerAccess] Team member:", teamMember);
  }

  return session;
}
