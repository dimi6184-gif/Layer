'use server';

import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { hasPermission } from '@/actions/team';
import { PERMISSIONS } from '@/lib/team-permissions';
import { auth } from '@/auth';
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
  try {
    await ensureServerAccess(guildId);
    const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
    if (!canManage) return { success: false, error: 'Missing permission: MANAGE_MODULES' };
    const session = await auth();
    const userId = session?.user?.id ?? null;
    const userName = session?.user?.name ?? 'Dashboard';

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
        userId,
        userName,
        details: 'Verification settings updated',
        metadata: settings as any,
      },
    }).catch(() => {});

    revalidatePath(`/dashboard/${guildId}/verification`);

    return { success: true };
  } catch (err: any) {
    console.error('[Verification] Error updating settings:', err);
    return { success: false, error: err.message || 'Failed to save settings' };
  }
}

export async function sendVerificationPanel(guildId: string, channelId: string) {
  try {
    await ensureServerAccess(guildId);
    const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
    if (!canManage) return { success: false, error: 'Missing permission: MANAGE_MODULES' };

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
      return {
        success: false,
        error: 'Verification is not enabled yet! Please switch it on in the Settings tab and click Save.',
      };
    }

    if (!guild.verificationRoleId) {
      return {
        success: false,
        error: 'No Verified Role selected! Please select a role in the Settings tab and click Save.',
      };
    }

    const botToken = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
    if (!botToken) {
      return {
        success: false,
        error: 'Discord Bot Token is missing in environment variables (DISCORD_BOT_TOKEN).',
      };
    }

    const embedColor = guild.verificationPanelColor
      ? parseInt(guild.verificationPanelColor.replace('#', ''), 16)
      : 0x10b981;

    let buttonEmojiObj: { name: string } | undefined = undefined;
    if (guild.verificationButtonEmoji && guild.verificationButtonEmoji.trim().length > 0) {
      buttonEmojiObj = { name: guild.verificationButtonEmoji.trim() };
    } else {
      buttonEmojiObj = { name: '✅' };
    }

    const body: any = {
      embeds: [
        {
          title: guild.verificationPanelTitle || '🔒 Server Verification',
          description:
            guild.verificationPanelDescription ||
            'Welcome to the server!\n\nClick the button below to verify yourself and gain access to the server.',
          color: isNaN(embedColor) ? 0x10b981 : embedColor,
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
              label: guild.verificationButtonLabel || 'Verify Me',
              emoji: buttonEmojiObj,
            },
          ],
        },
      ],
    };

    const discordRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!discordRes.ok) {
      const errData = await discordRes.json().catch(() => null);
      console.error('[Verification] Discord API error:', errData || discordRes.statusText);
      let errMsg = `Failed to post to Discord (${discordRes.status})`;
      if (errData?.code === 50013) {
        errMsg = 'Missing Permissions: The bot does not have permission to "Send Messages" and "Embed Links" in this channel.';
      } else if (errData?.message) {
        errMsg = `Discord error: ${errData.message}`;
      }
      return { success: false, error: errMsg };
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
    }).catch(() => {});

    revalidatePath(`/dashboard/${guildId}/verification`);

    return { success: true };
  } catch (err: any) {
    console.error('[Verification] Error in sendVerificationPanel:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export async function autoLockServer(guildId: string, verificationChannelId: string) {
  try {
    await ensureServerAccess(guildId);
    const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
    if (!canManage) return { success: false, error: 'Missing permission: MANAGE_MODULES' };

    // Get guild settings
    const guild = await db.guild.findUnique({
      where: { discordId: guildId },
      select: {
        verificationEnabled: true,
        verificationRoleId: true,
      },
    });

    if (!guild?.verificationEnabled) {
      return {
        success: false,
        error: 'Verification is not enabled yet! Please switch it on in the Settings tab and click Save.',
      };
    }

    if (!guild.verificationRoleId) {
      return {
        success: false,
        error: 'No Verified Role selected! Please select a role in the Settings tab and click Save.',
      };
    }

    const botToken = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
    if (!botToken) {
      return {
        success: false,
        error: 'Discord Bot Token is missing in environment variables (DISCORD_BOT_TOKEN).',
      };
    }

    // Fetch channels from Discord API
    const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: 'no-store',
    });

    if (!channelsRes.ok) {
      const errData = await channelsRes.json().catch(() => null);
      return {
        success: false,
        error: `Failed to fetch channels from Discord: ${errData?.message || channelsRes.statusText}`,
      };
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

    // Audit log
    await db.auditLog.create({
      data: {
        guildId,
        action: 'SERVER_AUTO_LOCKED',
        userId: null,
        userName: 'Dashboard',
        details: `Server auto-locked for verification (${channelsLocked} channels)`,
        metadata: { 
          channelsLocked,
          verificationChannelId 
        },
      },
    }).catch(() => {});

    revalidatePath(`/dashboard/${guildId}/verification`);

    return {
      success: true,
      channelsLocked,
      message: `Successfully locked ${channelsLocked} channels. Only verified users can see them now!`,
    };
  } catch (err: any) {
    console.error('[Verification] Error in autoLockServer:', err);
    return { success: false, error: err.message || 'Failed to auto-lock server' };
  }
}
