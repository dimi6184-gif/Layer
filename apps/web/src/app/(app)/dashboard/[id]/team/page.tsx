import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { TeamManagement } from "@/components/TeamManagement";
import { hasPermission } from "@/actions/team";
import { PERMISSIONS } from "@/lib/team-permissions";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guildId } = await params;

  await ensureServerAccess(guildId);

  const canView = await hasPermission(guildId, PERMISSIONS.VIEW_TEAM);

  if (!canView) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center rounded-2xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>Access Denied</p>
        <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>You don't have permission to view team management.</p>
      </div>
    );
  }

  const teamMembers = await db.teamMember.findMany({
    where: { guildId, status: "active" },
    include: {
      user: { select: { username: true, discordId: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Fetch Discord avatars for all members in one batch
  const avatarMap: Record<string, string | null> = {};
  await Promise.all(
    teamMembers.map(async (m) => {
      try {
        const res = await fetch(
          `https://discord.com/api/v10/users/${m.user.discordId}`,
          {
            headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
            next: { revalidate: 300 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          avatarMap[m.user.discordId] = data.avatar
            ? `https://cdn.discordapp.com/avatars/${m.user.discordId}/${data.avatar}.png?size=128`
            : null;
        } else {
          avatarMap[m.user.discordId] = null;
        }
      } catch {
        avatarMap[m.user.discordId] = null;
      }
    })
  );

  // Attach avatar URLs to members
  const membersWithAvatars = teamMembers.map((m) => ({
    ...m,
    avatarUrl: avatarMap[m.user.discordId] ?? null,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <TeamManagement guildId={guildId} teamMembers={membersWithAvatars as any} />
    </div>
  );
}
