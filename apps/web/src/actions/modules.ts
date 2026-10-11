"use server";

import { db } from "@nexus/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ensureServerAccess } from "@/lib/ensure-access";
import { hasPermission } from "./team";
import { PERMISSIONS } from "@/lib/team-permissions";
import {
  validateDiscordId,
  validateStringLength,
  validateArraySize,
  validateTicketSettings,
  validateAITicketSettings,
  validateGeneralSettings,
  sanitizeString,
} from "@/lib/validation";

export async function updateModuleStatus(discordId: string, module: 'aiEnabled' | 'moderationEnabled' | 'levelingEnabled' | 'musicEnabled' | 'ticketsEnabled' | 'antiScamEnabled', enabled: boolean) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_MODULES);
  if (!canManage) throw new Error("You don't have permission to manage modules");

  await db.guild.update({
    where: { discordId },
    data: { [module]: enabled }
  });

  revalidatePath(`/dashboard/${discordId}`);
  revalidatePath(`/dashboard/${discordId}/${module.replace('Enabled', '')}`);
  
  return { success: true };
}

export async function updateAIPersonality(discordId: string, personality: string) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_AI);
  if (!canManage) throw new Error("You don't have permission to manage AI settings");
  
  // Validate input
  validateStringLength(personality, 'Personality', { max: 2000 });
  const sanitizedPersonality = sanitizeString(personality);

  await db.guild.update({
    where: { discordId },
    data: { personality: sanitizedPersonality }
  });

  revalidatePath(`/dashboard/${discordId}/ai`);
  return { success: true };
}

export async function updateModerationSettings(discordId: string, bannedWords: string[], antiSpamEnabled: boolean) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_MODERATION);
  if (!canManage) throw new Error("You don't have permission to manage moderation settings");
  
  // Validate input
  validateArraySize(bannedWords, 'Banned words', { max: 500 });
  bannedWords.forEach((word, i) => validateStringLength(word, `Banned word[${i}]`, { min: 1, max: 100 }));
  const sanitizedWords = bannedWords.map(w => sanitizeString(w));

  await db.guild.update({
    where: { discordId },
    data: { bannedWords: sanitizedWords, antiSpamEnabled }
  });

  revalidatePath(`/dashboard/${discordId}/moderation`);
  return { success: true };
}

export async function updateAntiScamSettings(discordId: string, sensitivity: 'low' | 'medium' | 'high') {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_ANTISCAM);
  if (!canManage) throw new Error("You don't have permission to manage anti-scam settings");

  await db.guild.update({
    where: { discordId },
    data: { scamSensitivity: sensitivity }
  });

  revalidatePath(`/dashboard/${discordId}/anti-scam`);
  return { success: true };
}

export async function updateLevelingSettings(discordId: string, levelUpChannelId: string | null, levelRewards: any | null) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_LEVELING);
  if (!canManage) throw new Error("You don't have permission to manage leveling settings");

  await db.guild.update({
    where: { discordId },
    data: { levelUpChannelId, levelRewards }
  });

  revalidatePath(`/dashboard/${discordId}/leveling`);
  return { success: true };
}

export async function updateMusicSettings(discordId: string, djRoleIds: string[]) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_MUSIC);
  if (!canManage) throw new Error("You don't have permission to manage music settings");

  await db.guild.update({
    where: { discordId },
    data: { djRoleIds }
  });

  revalidatePath(`/dashboard/${discordId}/music`);
  return { success: true };
}

export async function updateTicketSettings(
  discordId: string,
  categoryId: string | null,
  supportRoleIds: string[],
  panelTitle: string,
  panelDescription: string,
  panelColor: string,
  buttonLabel: string,
  buttonEmoji: string,
  useDropdown?: boolean,
  reasons?: any[]
) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_TICKETS);
  if (!canManage) throw new Error("You don't have permission to manage ticket settings");
  
  // Validate all ticket settings
  validateTicketSettings({
    panelTitle,
    panelDescription,
    panelColor,
    buttonLabel,
    buttonEmoji,
    supportRoleIds,
    categoryId,
    reasons,
  });

  await db.guild.update({
    where: { discordId },
    data: {
      ticketCategoryId: categoryId,
      ticketSupportRoleIds: supportRoleIds,
      ticketPanelTitle: sanitizeString(panelTitle),
      ticketPanelDescription: sanitizeString(panelDescription),
      ticketPanelColor: panelColor,
      ticketButtonLabel: sanitizeString(buttonLabel),
      ticketButtonEmoji: sanitizeString(buttonEmoji),
      ticketUseDropdown: useDropdown || false,
      ticketReasons: reasons || [],
    },
  });

  revalidatePath(`/dashboard/${discordId}/tickets`);
  return { success: true };
}

export async function updateGeneralSettings(
  discordId: string,
  prefix: string,
  logChannelId: string | null,
  bannedWords: string[],
  antiSpamEnabled: boolean
) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_MODERATION);
  if (!canManage) throw new Error("You don't have permission to manage general settings");
  
  // Validate settings
  validateGeneralSettings({ prefix, logChannelId, bannedWords });
  const sanitizedWords = bannedWords.map(w => sanitizeString(w));

  await db.guild.update({
    where: { discordId },
    data: {
      prefix: sanitizeString(prefix),
      logChannelId,
      bannedWords: sanitizedWords,
      antiSpamEnabled,
    },
  });

  revalidatePath(`/dashboard/${discordId}/settings`);
  return { success: true };
}

export async function updateAITicketSettings(
  discordId: string,
  settings: {
    enabled: boolean;
    staffRoleIds: string[];
    personality: string | null;
    maxMessages: number;
    autoDelay: number;
    escalateAfter: number;
    confidenceMin: number;
    escalateRoleIds: string[];
    knowledgeBase: any;
    blacklist: string[];
    whitelist: string[];
    language: string;
  }
) {
  await ensureServerAccess(discordId);
  
  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_TICKETS);
  if (!canManage) throw new Error("You don't have permission to manage AI ticket settings");
  
  // Validate settings
  validateAITicketSettings(settings);
  
  const session = await auth();

  await db.guild.update({
    where: { discordId },
    data: {
      aiTicketModeratorEnabled: settings.enabled,
      aiTicketStaffRoleIds: settings.staffRoleIds,
      aiTicketPersonality: settings.personality ? sanitizeString(settings.personality) : null,
      aiTicketMaxMessages: settings.maxMessages,
      aiTicketAutoDelay: settings.autoDelay,
      aiTicketEscalateAfter: settings.escalateAfter,
      aiTicketConfidenceMin: settings.confidenceMin,
      aiTicketEscalateRoleIds: settings.escalateRoleIds,
      aiTicketKnowledgeBase: settings.knowledgeBase,
      aiTicketBlacklist: settings.blacklist.map(w => sanitizeString(w)),
      aiTicketWhitelist: settings.whitelist.map(w => sanitizeString(w)),
      aiTicketLanguage: settings.language,
    },
  });

  // Log the change
  await db.auditLog.create({
    data: {
      guildId: discordId,
      action: 'MODULE_TOGGLE',
      userId: session?.user?.id || 'unknown',
      userName: session?.user?.name || 'Unknown',
      details: `${settings.enabled ? 'Enabled' : 'Disabled'} AI Ticket Moderator`,
      metadata: { module: 'aiTicketModerator', enabled: settings.enabled },
    },
  }).catch(() => {});

  revalidatePath(`/dashboard/${discordId}/tickets`);
  return { success: true };
}
