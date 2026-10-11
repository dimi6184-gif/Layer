import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { GiveawayManager } from '@/components/GiveawayManager';
import { GiveawayEmojiSettings } from '@/components/GiveawayEmojiSettings';
import { fetchGuildChannels, fetchGuildRoles } from '@/lib/discord-channels';
import { ArrowLeft, Gift } from 'lucide-react';
import Link from 'next/link';

export default async function GiveawaysPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guildId } = await params;
  await ensureServerAccess(guildId);

  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: { customGiveawayEmoji: true },
  });

  const activeGiveaways = await db.giveaway.findMany({
    where: { guildId, ended: false },
    orderBy: { endsAt: 'asc' },
  });

  const endedGiveaways = await db.giveaway.findMany({
    where: { guildId, ended: true },
    orderBy: { endsAt: 'desc' },
    take: 20,
  });

  const channels = await fetchGuildChannels(guildId);
  const roles = await fetchGuildRoles(guildId);

  const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${guildId}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Gift className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Giveaway Manager
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Create and manage giveaways directly from the dashboard.</p>
        </div>
      </div>

      {/* Emoji Settings */}
      <div className="p-5 rounded-2xl" style={cardStyle}>
        <GiveawayEmojiSettings
          guildId={guildId}
          initialGiveawayEmoji={guild?.customGiveawayEmoji || '🎉'}
        />
      </div>

      {/* Manager */}
      <GiveawayManager
        guildId={guildId}
        activeGiveaways={activeGiveaways}
        endedGiveaways={endedGiveaways}
        channels={channels}
        roles={roles}
      />
    </div>
  );
}
