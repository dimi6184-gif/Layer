import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { VerificationSettings } from '@/components/VerificationSettings';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { fetchGuildChannels, fetchGuildRoles } from '@/lib/discord-channels';

export default async function VerificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guildId } = await params;
  await ensureServerAccess(guildId);

  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: {
      verificationEnabled: true,
      verificationRoleId: true,
      verificationPanelTitle: true,
      verificationPanelDescription: true,
      verificationPanelColor: true,
      verificationButtonLabel: true,
      verificationButtonEmoji: true,
      verificationCaptchaEnabled: true,
      verificationLogChannelId: true,
    },
  });

  const channels = await fetchGuildChannels(guildId);
  const roles = await fetchGuildRoles(guildId);

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${guildId}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <ShieldCheck className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Verification System
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Protect your server from bots and raiders.</p>
        </div>
      </div>

      <VerificationSettings
        guildId={guildId}
        settings={{
          enabled: guild?.verificationEnabled || false,
          roleId: guild?.verificationRoleId || '',
          panelTitle: guild?.verificationPanelTitle || '🔒 Server Verification',
          panelDescription: guild?.verificationPanelDescription || 'Welcome!\n\nClick below to verify and gain access.',
          panelColor: guild?.verificationPanelColor || '#10b981',
          buttonLabel: guild?.verificationButtonLabel || 'Verify Me',
          buttonEmoji: guild?.verificationButtonEmoji || '✅',
          captchaEnabled: guild?.verificationCaptchaEnabled !== false,
          logChannelId: guild?.verificationLogChannelId || '',
        }}
        channels={channels}
        roles={roles}
      />
    </div>
  );
}
