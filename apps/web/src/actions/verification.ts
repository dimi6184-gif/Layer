'use server';

import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { revalidatePath } from 'next/cache';

interface VerificationSettings {
  enabled: boolean;
  roleId: string;
  panelTitle: string;
  panelDescription: string;
  panelColor: string;
  buttonLabel: string;
  buttonEmoji: string;
  captchaEnabled: boolean;
  logChannelId: string;
}

export async function updateVerificationSettings(
  guildId: string,
  settings: VerificationSettings
) {
  await ensureServerAccess(guildId);

  await db.guild.update({
    where: { discordId: guildId },
    data: {
      verificationEnabled: settings.enabled,
      verificationRoleId: settings.roleId || null,
      verificationPanelTitle: settings.panelTitle,
      verificationPanelDescription: settings.panelDescription,
      verificationPanelColor: settings.panelColor,
      verificationButtonLabel: settings.buttonLabel,
      verificationButtonEmoji: settings.buttonEmoji,
      verificationCaptchaEnabled: settings.captchaEnabled,
      verificationLogChannelId: settings.logChannelId || null,
    },
  });

  // Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: 'VERIFICATION_SETTINGS_UPDATED',
      userId: null,
      userName: 'Dashboard',
      details: 'Verification settings updated',
      metadata: settings as any,
    },
  });

  revalidatePath(`/dashboard/${guildId}/verification`);
}

export async function sendVerificationPanel(guildId: string, channelId: string) {
  await ensureServerAccess(guildId);

  // Get guild settings
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
    },
  });

  if (!guild?.verificationEnabled) {
    throw new Error('Verification is not enabled');
  }

  if (!guild.verificationRoleId) {
    throw new Error('No verification role configured');
  }

  // Build embed data
  const embedData = {
    title: guild.verificationPanelTitle || '🔒 Server Verification',
    description:
      guild.verificationPanelDescription ||
      'Welcome to the server!\n\nClick the button below to verify yourself and gain access to the server.',
    color: parseInt(guild.verificationPanelColor?.replace('#', '') || '10b981', 16),
  };

  const buttonData = {
    label: guild.verificationButtonLabel || 'Verify Me',
    emoji: guild.verificationButtonEmoji || '✅',
  };

  // Send to Discord via official Discord REST API (works directly from Vercel)
  const botToken = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
  if (!botToken) {
    throw new Error('Discord Bot Token is not configured in server environment');
  }

  const embedColor = embedData.color && !isNaN(embedData.color) ? embedData.color : 0x10b981;
  const buttonEmojiObj = buttonData.emoji ? { name: buttonData.emoji } : { name: '✅' };

  const discordRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      embeds: [
        {
          title: embedData.title,
          description: embedData.description,
          color: embedColor,
          timestamp: new Date().toISOString(),
        },
      ],
      components: [
        {
          type: 1, // ActionRow
          components: [
            {
              type: 2, // Button
              style: 3, // Success (green)
              custom_id: 'verification:verify',
              label: buttonData.label || 'Verify Me',
              emoji: buttonEmojiObj,
            },
          ],
        },
      ],
    }),
  });

  if (!discordRes.ok) {
    const errorText = await discordRes.text();
    console.error('[Verification] Discord API error:', errorText);
    throw new Error(`Failed to post panel to Discord: ${discordRes.statusText}`);
  }

  // Update channel ID in database
  await db.guild.update({
    where: { discordId: guildId },
    data: { verificationChannelId: channelId },
  });

  // Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: 'VERIFICATION_PANEL_SENT',
      userId: null,
      userName: 'Dashboard',
      details: `Verification panel sent to channel ${channelId}`,
      metadata: { channelId },
    },
  });

  revalidatePath(`/dashboard/${guildId}/verification`);

  return { success: true };
}

export async function autoLockServer(guildId: string, verificationChannelId: string) {
  await ensureServerAccess(guildId);

  // Get guild settings
  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: {
      verificationEnabled: true,
      verificationRoleId: true,
    },
  });

  if (!guild?.verificationEnabled) {
    throw new Error('Verification is not enabled');
  }

  if (!guild.verificationRoleId) {
    throw new Error('No verification role configured');
  }

  const botToken = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
  if (!botToken) {
    throw new Error('Discord Bot Token is not configured');
  }

  // Fetch channels from Discord API
  const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
    cache: 'no-store',
  });

  if (!channelsRes.ok) {
    throw new Error(`Failed to fetch server channels from Discord: ${channelsRes.statusText}`);
  }

  const channels: Array<{ id: string; name: string; type: number }> = await channelsRes.json();
  const everyoneRoleId = guildId; // In Discord, @everyone role ID is the guildId
  const verifiedRoleId = guild.verificationRoleId;
  let channelsLocked = 0;

  // ViewChannel = 1024, SendMessages = 2048, ReadMessageHistory = 65536
  for (const channel of channels) {
    // Skip category (type 4)
    if (channel.type === 4) continue;

    try {
      if (channel.id === verificationChannelId) {
        // === VERIFICATION CHANNEL ===
        // @everyone CAN view and read, CANNOT send messages
        await fetch(`https://discord.com/api/v10/channels/${channel.id}/permissions/${everyoneRoleId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 0, // Role
            allow: String(1024 | 65536),
            deny: String(2048),
          }),
        });

        // verifiedRole CANNOT view verification channel once verified
        await fetch(`https://discord.com/api/v10/channels/${channel.id}/permissions/${verifiedRoleId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 0, // Role
            allow: '0',
            deny: String(1024),
          }),
        });
      } else {
        // === ALL OTHER CHANNELS ===
        // @everyone CANNOT view
        await fetch(`https://discord.com/api/v10/channels/${channel.id}/permissions/${everyoneRoleId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 0, // Role
            allow: '0',
            deny: String(1024),
          }),
        });

        // verifiedRole CAN view
        await fetch(`https://discord.com/api/v10/channels/${channel.id}/permissions/${verifiedRoleId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 0, // Role
            allow: String(1024),
            deny: '0',
          }),
        });

        channelsLocked++;
      }
    } catch (err: any) {
      console.error(`Failed to lock channel ${channel.name}:`, err);
    }
  }

  const result = {
    success: true,
    channelsLocked,
    message: `Successfully locked ${channelsLocked} channels. Only verified users can see them now!`,
  };

  // Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: 'SERVER_AUTO_LOCKED',
      userId: null,
      userName: 'Dashboard',
      details: `Server auto-locked for verification (${result.channelsLocked} channels)`,
      metadata: { 
        channelsLocked: result.channelsLocked,
        verificationChannelId 
      },
    },
  });

  revalidatePath(`/dashboard/${guildId}/verification`);

  return result;
}
