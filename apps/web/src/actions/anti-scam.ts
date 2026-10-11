"use server";

import { auth } from "@/auth";
import { db } from "@nexus/db";
import { revalidatePath } from "next/cache";
import { ensureServerAccess } from "@/lib/ensure-access";
import { hasPermission } from "./team";
import { PERMISSIONS } from "@/lib/team-permissions";

export async function updateAntiScamSettings(
  guildId: string,
  settings: {
    enabled: boolean;
    sensitivity: "low" | "medium" | "high";
  }
) {
  await ensureServerAccess(guildId);
  
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_ANTISCAM);
  if (!canManage) {
    throw new Error("You don't have permission to manage anti-scam settings");
  }
  
  const session = await auth();

  await db.guild.update({
    where: { discordId: guildId },
    data: {
      antiScamEnabled: settings.enabled,
      scamSensitivity: settings.sensitivity,
    },
  });

  // Log action
  await db.auditLog.create({
    data: {
      guildId,
      action: "MODULE_TOGGLE",
      userId: session?.user?.id || "unknown",
      userName: session?.user?.name || "Unknown",
      details: `Anti-Scam ${settings.enabled ? "enabled" : "disabled"} with ${settings.sensitivity} sensitivity`,
      metadata: settings,
    },
  });

  revalidatePath(`/dashboard/${guildId}/anti-scam`);
}
