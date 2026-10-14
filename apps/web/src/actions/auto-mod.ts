'use server';

import { auth } from '@/auth';
import { db } from '@nexus/db';
import { ensureServerAccess } from '@/lib/ensure-access';
import { hasPermission } from './team';
import { PERMISSIONS } from '@/lib/team-permissions';
import { validateAutoModSettings } from '@/lib/validation';

export async function updateAutoModSettings(guildId: string, settings: {
  autoModEnabled: boolean;
  
  // Spam
  autoModSpamEnabled: boolean;
  autoModSpamMaxMessages: number;
  autoModSpamTimeframe: number;
  autoModSpamAction: string;
  autoModSpamTimeoutDuration: number;
  
  // Caps
  autoModCapsEnabled: boolean;
  autoModCapsThreshold: number;
  autoModCapsMinLength: number;
  autoModCapsAction: string;
  
  // Links
  autoModLinksEnabled: boolean;
  autoModLinksWhitelist: string[];
  autoModLinksAction: string;
  
  // Invites
  autoModInvitesEnabled: boolean;
  autoModInvitesAction: string;
  
  // Mentions
  autoModMentionsEnabled: boolean;
  autoModMentionsMax: number;
  autoModMentionsAction: string;
  
  // Emojis
  autoModEmojisEnabled: boolean;
  autoModEmojisMax: number;
  autoModEmojisAction: string;
  
  // Attachments
  autoModAttachmentsEnabled: boolean;
  autoModAttachmentsAction: string;
  
  // Whitelist
  autoModWhitelistChannels: string[];
  autoModWhitelistRoles: string[];
  
  // Duplicates
  autoModDuplicatesEnabled: boolean;
  autoModDuplicatesTimeframe: number;
  autoModDuplicatesAction: string;
}) {
  await ensureServerAccess(guildId);
  
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODERATION);
  if (!canManage) {
    throw new Error("You don't have permission to manage auto-mod settings");
  }
  
  // Validate all settings
  validateAutoModSettings(settings);
  
  const session = await auth();

  // SECURITY: Explicitly whitelist only allowed fields — never spread raw input into db.guild.update
  await db.guild.update({
    where: { discordId: guildId },
    data: {
      autoModEnabled: settings.autoModEnabled,
      autoModSpamEnabled: settings.autoModSpamEnabled,
      autoModSpamMaxMessages: settings.autoModSpamMaxMessages,
      autoModSpamTimeframe: settings.autoModSpamTimeframe,
      autoModSpamAction: settings.autoModSpamAction,
      autoModSpamTimeoutDuration: settings.autoModSpamTimeoutDuration,
      autoModCapsEnabled: settings.autoModCapsEnabled,
      autoModCapsThreshold: settings.autoModCapsThreshold,
      autoModCapsMinLength: settings.autoModCapsMinLength,
      autoModCapsAction: settings.autoModCapsAction,
      autoModLinksEnabled: settings.autoModLinksEnabled,
      autoModLinksWhitelist: settings.autoModLinksWhitelist,
      autoModLinksAction: settings.autoModLinksAction,
      autoModInvitesEnabled: settings.autoModInvitesEnabled,
      autoModInvitesAction: settings.autoModInvitesAction,
      autoModMentionsEnabled: settings.autoModMentionsEnabled,
      autoModMentionsMax: settings.autoModMentionsMax,
      autoModMentionsAction: settings.autoModMentionsAction,
      autoModEmojisEnabled: settings.autoModEmojisEnabled,
      autoModEmojisMax: settings.autoModEmojisMax,
      autoModEmojisAction: settings.autoModEmojisAction,
      autoModAttachmentsEnabled: settings.autoModAttachmentsEnabled,
      autoModAttachmentsAction: settings.autoModAttachmentsAction,
      autoModWhitelistChannels: settings.autoModWhitelistChannels,
      autoModWhitelistRoles: settings.autoModWhitelistRoles,
      autoModDuplicatesEnabled: settings.autoModDuplicatesEnabled,
      autoModDuplicatesTimeframe: settings.autoModDuplicatesTimeframe,
      autoModDuplicatesAction: settings.autoModDuplicatesAction,
    },
  });

  // Log audit
  await db.auditLog.create({
    data: {
      guildId,
      action: 'MODULE_TOGGLE',
      userId: session?.user?.id || 'unknown',
      userName: session?.user?.name || 'Unknown',
      details: `Updated Auto-Mod settings`,
      metadata: { feature: 'auto-mod' },
    },
  });

  return { success: true };
}
