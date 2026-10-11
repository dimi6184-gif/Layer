import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { WelcomeSettings } from '@/components/WelcomeSettings';
import { fetchGuildChannels, fetchGuildRoles } from '@/lib/discord-channels';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default async function WelcomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guildId } = await params;
  await ensureServerAccess(guildId);

  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: {
      welcomeEnabled: true, welcomeChannelId: true, welcomeMessage: true,
      welcomeEmbedEnabled: true, welcomeEmbedTitle: true, welcomeEmbedDescription: true,
      welcomeEmbedColor: true, welcomeImageEnabled: true, welcomeImageConfig: true,
      welcomeDMEnabled: true, welcomeDMMessage: true, autoRoleIds: true,
      leaveEnabled: true, leaveChannelId: true, leaveMessage: true,
      leaveEmbedEnabled: true, leaveEmbedTitle: true, leaveEmbedDescription: true, leaveEmbedColor: true,
    },
  });

  if (!guild) throw new Error('Guild not found');

  const channels = await fetchGuildChannels(guildId);
  const roles = await fetchGuildRoles(guildId);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${guildId}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <UserPlus className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Welcome & Leave
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Customize welcome and leave messages for your server.</p>
        </div>
      </div>

      <WelcomeSettings
        guildId={guildId}
        settings={{
          welcomeEnabled: guild.welcomeEnabled,
          welcomeChannelId: guild.welcomeChannelId || '',
          welcomeMessage: guild.welcomeMessage || '',
          welcomeEmbedEnabled: guild.welcomeEmbedEnabled,
          welcomeEmbedTitle: guild.welcomeEmbedTitle,
          welcomeEmbedDescription: guild.welcomeEmbedDescription,
          welcomeEmbedColor: guild.welcomeEmbedColor,
          welcomeImageEnabled: guild.welcomeImageEnabled,
          welcomeImageConfig: guild.welcomeImageConfig,
          welcomeDMEnabled: guild.welcomeDMEnabled,
          welcomeDMMessage: guild.welcomeDMMessage || '',
          autoRoleIds: guild.autoRoleIds,
          leaveEnabled: guild.leaveEnabled,
          leaveChannelId: guild.leaveChannelId || '',
          leaveMessage: guild.leaveMessage || '',
          leaveEmbedEnabled: guild.leaveEmbedEnabled,
          leaveEmbedTitle: guild.leaveEmbedTitle,
          leaveEmbedDescription: guild.leaveEmbedDescription,
          leaveEmbedColor: guild.leaveEmbedColor,
        }}
        channels={channels}
        roles={roles}
      />
    </div>
  );
}
