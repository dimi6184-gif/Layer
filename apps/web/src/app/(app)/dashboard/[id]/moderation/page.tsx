import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ensureServerAccess } from "@/lib/ensure-access";
import { fetchGuildChannels, fetchGuildRoles } from "@/lib/discord-channels";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { ModuleSwitch } from "@/components/ModuleSwitch";
import { ModerationSettings } from "@/components/ModerationSettings";

export default async function ModerationModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Ensure user has access
  await ensureServerAccess(id);
  
  // Fetch guild from DB
  const guild = await db.guild.findUnique({
    where: { discordId: id }
  });

  if (!guild) {
    redirect("/dashboard");
  }

  // Fetch channels and roles using helper functions
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
            <Shield className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Auto Moderation
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Configure filters, anti-spam, and automated punishments.</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Toggle Panel */}
        <div
          className="p-5 rounded-2xl flex items-center justify-between"
          style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Auto Moderation</h3>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Protects your server from spam, bad words, and malicious links automatically.</p>
          </div>
          <ModuleSwitch discordId={id} module="moderationEnabled" initialEnabled={guild.moderationEnabled} />
        </div>

        {/* Detailed Filters Config */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <ModerationSettings 
            discordId={id} 
            initialBannedWords={guild.bannedWords || []} 
            initialAntiSpam={guild.antiSpamEnabled || false}
            autoModSettings={{
              autoModEnabled: guild.autoModEnabled ?? false,
              
              autoModSpamEnabled: guild.autoModSpamEnabled ?? true,
              autoModSpamMaxMessages: guild.autoModSpamMaxMessages ?? 5,
              autoModSpamTimeframe: guild.autoModSpamTimeframe ?? 5,
              autoModSpamAction: guild.autoModSpamAction ?? 'delete',
              autoModSpamTimeoutDuration: guild.autoModSpamTimeoutDuration ?? 300,
              
              autoModCapsEnabled: guild.autoModCapsEnabled ?? false,
              autoModCapsThreshold: guild.autoModCapsThreshold ?? 70,
              autoModCapsMinLength: guild.autoModCapsMinLength ?? 10,
              autoModCapsAction: guild.autoModCapsAction ?? 'delete',
              
              autoModLinksEnabled: guild.autoModLinksEnabled ?? false,
              autoModLinksWhitelist: guild.autoModLinksWhitelist ?? [],
              autoModLinksAction: guild.autoModLinksAction ?? 'delete',
              
              autoModInvitesEnabled: guild.autoModInvitesEnabled ?? false,
              autoModInvitesAction: guild.autoModInvitesAction ?? 'delete',
              
              autoModMentionsEnabled: guild.autoModMentionsEnabled ?? false,
              autoModMentionsMax: guild.autoModMentionsMax ?? 5,
              autoModMentionsAction: guild.autoModMentionsAction ?? 'delete',
              
              autoModEmojisEnabled: guild.autoModEmojisEnabled ?? false,
              autoModEmojisMax: guild.autoModEmojisMax ?? 10,
              autoModEmojisAction: guild.autoModEmojisAction ?? 'delete',
              
              autoModAttachmentsEnabled: guild.autoModAttachmentsEnabled ?? false,
              autoModAttachmentsAction: guild.autoModAttachmentsAction ?? 'delete',
              
              autoModWhitelistChannels: guild.autoModWhitelistChannels ?? [],
              autoModWhitelistRoles: guild.autoModWhitelistRoles ?? [],
              
              autoModDuplicatesEnabled: guild.autoModDuplicatesEnabled ?? false,
              autoModDuplicatesTimeframe: guild.autoModDuplicatesTimeframe ?? 60,
              autoModDuplicatesAction: guild.autoModDuplicatesAction ?? 'delete',
            }}
            channels={textChannels.map((c: any) => ({ id: c.id, name: c.name }))}
            roles={roles.map((r: any) => ({ id: r.id, name: r.name }))}
          />
        </div>
      </div>
    </div>
  );
}
