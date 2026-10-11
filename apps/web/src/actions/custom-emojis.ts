"use server";

import { db } from "@nexus/db";
import { revalidatePath } from "next/cache";
import { ensureServerAccess } from "@/lib/ensure-access";
import { hasPermission } from "./team";
import { PERMISSIONS } from "@/lib/team-permissions";
import { validateArraySize, validateStringLength } from "@/lib/validation";

export async function updateCustomEmojis(
  guildId: string,
  data: {
    customPollEmojis?: string[];
    customGiveawayEmoji?: string;
  }
) {
  try {
    await ensureServerAccess(guildId);
    
    const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
    if (!canManage) {
      return { success: false, error: "You don't have permission to manage custom emojis" };
    }
    
    // Validate poll emojis (must be exactly 4)
    if (data.customPollEmojis) {
      if (data.customPollEmojis.length !== 4) {
        return { success: false, error: "Poll emojis must be exactly 4 emojis" };
      }
      validateArraySize(data.customPollEmojis, 'Poll emojis', { min: 4, max: 4 });
      data.customPollEmojis.forEach((emoji, i) => {
        validateStringLength(emoji, `Poll emoji[${i}]`, { min: 1, max: 100 });
      });
    }
    
    // Validate giveaway emoji
    if (data.customGiveawayEmoji) {
      validateStringLength(data.customGiveawayEmoji, 'Giveaway emoji', { min: 1, max: 100 });
    }

    await db.guild.update({
      where: { discordId: guildId },
      data,
    });

    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("[Custom Emojis] Failed to update:", error);
    return { success: false, error: "Failed to update custom emojis" };
  }
}
