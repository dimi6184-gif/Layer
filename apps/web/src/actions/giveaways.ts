'use server';

import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { revalidatePath } from 'next/cache';

interface CreateGiveawayData {
  prize: string;
  description?: string;
  duration: number; // in seconds
  winnerCount: number;
  channelId: string;
  requiredRoleIds?: string[];
  requiredLevel?: number;
  requireBoost?: boolean;
  blacklistedRoleIds?: string[];
}

export async function createGiveaway(guildId: string, data: CreateGiveawayData) {
  const session = await ensureServerAccess(guildId);

  // SECURITY: Validate duration bounds to prevent extremely long or short giveaways
  if (data.duration < 60) throw new Error('Giveaway must last at least 1 minute');
  if (data.duration > 30 * 24 * 3600) throw new Error('Giveaway cannot last more than 30 days');
  if (data.winnerCount < 1 || data.winnerCount > 20) throw new Error('Winner count must be between 1 and 20');
  if (!data.prize || data.prize.trim().length === 0) throw new Error('Prize is required');
  if (data.prize.length > 200) throw new Error('Prize must be under 200 characters');

  const endsAt = new Date(Date.now() + data.duration * 1000);

  // Build embed data
  const requirements: string[] = [];
  if (data.requiredRoleIds && data.requiredRoleIds.length > 0) {
    requirements.push(`Role required`);
  }
  if (data.requiredLevel) requirements.push(`Level ${data.requiredLevel}+`);
  if (data.requireBoost) requirements.push(`Server Boost required`);
  if (data.blacklistedRoleIds && data.blacklistedRoleIds.length > 0) {
    requirements.push(`Role blacklist active`);
  }

  const giveawayData = {
    prize: data.prize,
    description: data.description,
    winnerCount: data.winnerCount,
    channelId: data.channelId,
    duration: data.duration,
    endsAt,
    requiredRoleIds: data.requiredRoleIds || [],
    requiredLevel: data.requiredLevel,
    requireBoost: data.requireBoost || false,
    blacklistedRoleIds: data.blacklistedRoleIds || [],
  };

  // Send to Discord via bot API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:3001'}/api/create-giveaway`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BOT_API_SECRET || 'dev-secret'}`,
      },
      body: JSON.stringify({
        guildId,
        ...giveawayData,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create giveaway: ${error}`);
  }

  const result = await res.json();

  // Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: 'GIVEAWAY_CREATED',
      userId: null,
      userName: 'Dashboard',
      details: `Giveaway created for ${data.prize}`,
      metadata: { prize: data.prize, winners: data.winnerCount },
    },
  });

  revalidatePath(`/dashboard/${guildId}/giveaways`);

  return result;
}

export async function endGiveaway(guildId: string, messageId: string) {
  await ensureServerAccess(guildId);

  // Send to bot API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:3001'}/api/end-giveaway`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BOT_API_SECRET || 'dev-secret'}`,
      },
      body: JSON.stringify({ guildId, messageId }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to end giveaway: ${error}`);
  }

  // Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: 'GIVEAWAY_ENDED',
      userId: null,
      userName: 'Dashboard',
      details: 'Giveaway ended via dashboard',
      metadata: { messageId },
    },
  });

  revalidatePath(`/dashboard/${guildId}/giveaways`);

  return { success: true };
}

export async function rerollGiveaway(guildId: string, messageId: string, winnersCount: number = 1) {
  await ensureServerAccess(guildId);

  // Send to bot API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:3001'}/api/reroll-giveaway`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BOT_API_SECRET || 'dev-secret'}`,
      },
      body: JSON.stringify({ guildId, messageId, winnersCount }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to reroll giveaway: ${error}`);
  }

  const result = await res.json();

  // Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: 'GIVEAWAY_REROLLED',
      userId: null,
      userName: 'Dashboard',
      details: `Rerolled ${winnersCount} winner(s)`,
      metadata: { messageId, winnersCount },
    },
  });

  revalidatePath(`/dashboard/${guildId}/giveaways`);

  return result;
}

export async function deleteGiveaway(guildId: string, giveawayId: string) {
  const session = await ensureServerAccess(guildId);

  // SECURITY: Include guildId constraint to prevent cross-guild deletion (object-level IDOR)
  const deleted = await db.giveaway.deleteMany({
    where: { id: giveawayId, guildId },
  });

  if (deleted.count === 0) {
    throw new Error('Giveaway not found or does not belong to this server');
  }

  // Audit log with user attribution
  await db.auditLog.create({
    data: {
      guildId,
      action: 'GIVEAWAY_DELETED',
      userId: (session.user as any)?.id ?? null,
      userName: session.user?.name ?? 'Dashboard',
      details: 'Giveaway deleted from database',
      metadata: { giveawayId },
    },
  });

  revalidatePath(`/dashboard/${guildId}/giveaways`);

  return { success: true };
}
