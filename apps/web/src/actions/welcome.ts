'use server';

import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { hasPermission } from '@/actions/team';
import { PERMISSIONS } from '@/lib/team-permissions';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

interface WelcomeSettings {
  welcomeEnabled: boolean;
  welcomeChannelId?: string;
  welcomeMessage?: string;
  welcomeEmbedEnabled: boolean;
  welcomeEmbedTitle: string;
  welcomeEmbedDescription: string;
  welcomeEmbedColor: string;
  welcomeImageEnabled: boolean;
  welcomeImageConfig?: any; // ImageConfig JSON
  welcomeDMEnabled: boolean;
  welcomeDMMessage?: string;
  autoRoleIds: string[];
}

interface LeaveSettings {
  leaveEnabled: boolean;
  leaveChannelId?: string;
  leaveMessage?: string;
  leaveEmbedEnabled: boolean;
  leaveEmbedTitle: string;
  leaveEmbedDescription: string;
  leaveEmbedColor: string;
}

export async function updateWelcomeSettings(guildId: string, settings: WelcomeSettings) {
  await ensureServerAccess(guildId);
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
  if (!canManage) throw new Error('Missing permission: MANAGE_MODULES');
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const userName = session?.user?.name ?? 'Dashboard';

  await db.guild.update({
    where: { discordId: guildId },
    data: {
      welcomeEnabled: settings.welcomeEnabled,
      welcomeChannelId: settings.welcomeChannelId || null,
      welcomeMessage: settings.welcomeMessage || null,
      welcomeEmbedEnabled: settings.welcomeEmbedEnabled,
      welcomeEmbedTitle: settings.welcomeEmbedTitle,
      welcomeEmbedDescription: settings.welcomeEmbedDescription,
      welcomeEmbedColor: settings.welcomeEmbedColor,
      welcomeImageEnabled: settings.welcomeImageEnabled,
      welcomeImageConfig: settings.welcomeImageConfig || null,
      welcomeDMEnabled: settings.welcomeDMEnabled,
      welcomeDMMessage: settings.welcomeDMMessage || null,
      autoRoleIds: settings.autoRoleIds,
    },
  });

  await db.auditLog.create({
    data: {
      guildId,
      action: 'WELCOME_SETTINGS_UPDATED',
      userId,
      userName,
      details: 'Welcome settings updated',
      metadata: settings as any,
    },
  });

  revalidatePath(`/dashboard/${guildId}/welcome`);
}

export async function updateLeaveSettings(guildId: string, settings: LeaveSettings) {
  await ensureServerAccess(guildId);
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
  if (!canManage) throw new Error('Missing permission: MANAGE_MODULES');
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const userName = session?.user?.name ?? 'Dashboard';

  await db.guild.update({
    where: { discordId: guildId },
    data: {
      leaveEnabled: settings.leaveEnabled,
      leaveChannelId: settings.leaveChannelId || null,
      leaveMessage: settings.leaveMessage || null,
      leaveEmbedEnabled: settings.leaveEmbedEnabled,
      leaveEmbedTitle: settings.leaveEmbedTitle,
      leaveEmbedDescription: settings.leaveEmbedDescription,
      leaveEmbedColor: settings.leaveEmbedColor,
    },
  });

  await db.auditLog.create({
    data: {
      guildId,
      action: 'LEAVE_SETTINGS_UPDATED',
      userId,
      userName,
      details: 'Leave settings updated',
      metadata: settings as any,
    },
  });

  revalidatePath(`/dashboard/${guildId}/welcome`);
}
