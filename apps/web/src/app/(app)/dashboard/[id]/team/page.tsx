import { auth } from "@/auth";
import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { TeamManagement } from "@/components/TeamManagement";
import { hasPermission } from "@/actions/team";
import { PERMISSIONS } from "@/lib/team-permissions";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guildId } = await params;

  // Ensure user has access (auto-creates owner if first user)
  await ensureServerAccess(guildId);

  // Check if user has permission to view team
  const canView = await hasPermission(guildId, PERMISSIONS.VIEW_TEAM);
  
  if (!canView) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-zinc-400">
            You don't have permission to view team management for this server.
          </p>
        </div>
      </div>
    );
  }

  // Get team members (only active ones)
  const teamMembers = await db.teamMember.findMany({
    where: { 
      guildId,
      status: "active",
    },
    include: {
      user: {
        select: {
          username: true,
          discordId: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <TeamManagement guildId={guildId} teamMembers={teamMembers as any} />
    </div>
  );
}
