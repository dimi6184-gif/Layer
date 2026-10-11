import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ensureServerAccess } from "@/lib/ensure-access";
import { fetchGuildChannels, fetchGuildRoles } from "@/lib/discord-channels";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { AdvancedModSettings } from "@/components/AdvancedModSettings";

export default async function AdvancedModPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({ where: { discordId: id } });
  if (!guild) redirect("/dashboard");

  const channels = await fetchGuildChannels(id);
  const roles = await fetchGuildRoles(id);
  const textChannels = channels.filter((c: any) => c.type === 0 || c.type === 5);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Shield className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Advanced Moderation
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Avatar tracking, impersonation detection, and ghost member cleanup.</p>
        </div>
      </div>

      <AdvancedModSettings
        discordId={id}
        settings={{
          avatarTrackingEnabled: guild!.avatarTrackingEnabled ?? false,
          avatarHistoryLimit: guild!.avatarHistoryLimit ?? 10,
          avatarLogChannelId: guild!.avatarLogChannelId ?? null,
          impersonationEnabled: guild!.impersonationEnabled ?? false,
          impersonationAutoAction: guild!.impersonationAutoAction ?? false,
          impersonationActionType: (guild!.impersonationActionType as "KICK" | "BAN") ?? "KICK",
          impersonationSensitivity: (guild!.impersonationSensitivity as "LOW" | "MEDIUM" | "HIGH") ?? "MEDIUM",
          ghostCleanerEnabled: guild!.ghostCleanerEnabled ?? false,
          ghostInactivityDays: guild!.ghostInactivityDays ?? 90,
          ghostWarningDays: guild!.ghostWarningDays ?? 7,
          ghostMaxWarnings: guild!.ghostMaxWarnings ?? 2,
          ghostExemptRoles: guild!.ghostExemptRoles ?? [],
          ghostKickBots: guild!.ghostKickBots ?? false,
        }}
        channels={textChannels.map((c: any) => ({ id: c.id, name: c.name }))}
        roles={roles.map((r: any) => ({ id: r.id, name: r.name }))}
      />
    </div>
  );
}
