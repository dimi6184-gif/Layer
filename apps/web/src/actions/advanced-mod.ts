"use server";

import { auth } from "@/auth";
import { db } from "@nexus/db";
import { revalidatePath } from "next/cache";
import { ensureServerAccess } from "@/lib/ensure-access";
import { hasPermission } from "./team";
import { PERMISSIONS } from "@/lib/team-permissions";

export async function updateAdvancedModSettings(
  discordId: string,
  settings: {
    // Avatar History
    avatarHistoryLimit: number;
    avatarLogChannelId: string | null;

    // Impersonation
    impersonationAutoAction: boolean;
    impersonationActionType: "KICK" | "BAN";
    impersonationSensitivity: "LOW" | "MEDIUM" | "HIGH";

    // Ghost Cleaner
    ghostInactivityDays: number;
    ghostWarningDays: number;
    ghostMaxWarnings: number;
    ghostExemptRoles: string[];
    ghostKickBots: boolean;
  }
) {
  // 🔒 SECURITY: Authentication and Authorization
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await ensureServerAccess(discordId);

  const canManage = await hasPermission(discordId, PERMISSIONS.MANAGE_MODERATION);
  if (!canManage) {
    throw new Error("You don't have permission to manage moderation settings");
  }

  try {
    await db.guild.update({
      where: { discordId },
      data: {
        // Avatar History
        avatarHistoryLimit: settings.avatarHistoryLimit,
        avatarLogChannelId: settings.avatarLogChannelId,

        // Impersonation
        impersonationEnabled: settings.impersonationAutoAction,
        impersonationAutoAction: settings.impersonationActionType.toLowerCase(),
        impersonationSensitivity: settings.impersonationSensitivity.toLowerCase(),

        // Ghost Cleaner
        ghostInactiveDays: settings.ghostInactivityDays,
        ghostWarningDays: settings.ghostWarningDays,
        ghostWhitelistRoles: settings.ghostExemptRoles,
      },
    });

    // Log action
    await db.auditLog.create({
      data: {
        guildId: discordId,
        action: "ADVANCED_MOD_SETTINGS_UPDATED",
        userId: session.user.id,
        userName: session.user.name || "Unknown",
        details: "Updated advanced moderation settings",
        metadata: settings,
      },
    });

    revalidatePath(`/dashboard/${discordId}/advanced-mod`);
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to update advanced mod settings:", error);
    }
    return { success: false, error: "Failed to update settings" };
  }
}
