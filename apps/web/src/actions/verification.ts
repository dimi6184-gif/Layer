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

  // Send to Discord via bot
  const res = await fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:3001'}/api/send-verification-panel`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BOT_API_SECRET || 'dev-secret'}`
    },
    body: JSON.stringify({
      guildId,
      channelId,
      embed: embedData,
      button: buttonData,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to send panel: ${error}`);
  }

  // Update channel ID
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

  // Send request to bot
  const res = await fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:3001'}/api/auto-lock-server`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BOT_API_SECRET || 'dev-secret'}`
    },
    body: JSON.stringify({
      guildId,
      verifiedRoleId: guild.verificationRoleId,
      verificationChannelId,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to lock server: ${error}`);
  }

  const result = await res.json();

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
