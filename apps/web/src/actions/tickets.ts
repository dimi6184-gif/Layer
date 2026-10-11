"use server";

import { auth } from "@/auth";
import { db } from "@nexus/db";
import { revalidatePath } from "next/cache";
import { ensureServerAccess } from "@/lib/ensure-access";
import { hasPermission } from "./team";
import { PERMISSIONS } from "@/lib/team-permissions";
import { validateDiscordId } from "@/lib/validation";
import type { Prisma } from "@nexus/db";

// Update ticket transcript settings
export async function updateTicketTranscriptSettings(
  guildId: string,
  settings: {
    enabled: boolean;
    channelId: string;
  }
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await ensureServerAccess(guildId);

  // Check permission
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_TICKETS);
  if (!canManage) {
    throw new Error("You don't have permission to manage ticket settings");
  }

  // Validate channelId
  if (settings.enabled && settings.channelId) {
    validateDiscordId(settings.channelId, "Channel ID");
  }

  await db.guild.update({
    where: { discordId: guildId },
    data: {
      ticketTranscriptEnabled: settings.enabled,
      ticketTranscriptChannelId: settings.enabled ? settings.channelId : null,
    },
  });

  // Log action
  await db.auditLog.create({
    data: {
      guildId,
      action: "TICKET_TRANSCRIPT_SETTINGS_UPDATED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: `Updated ticket transcript settings`,
      metadata: settings,
    },
  });

  revalidatePath(`/dashboard/${guildId}/tickets`);
}

// Fetch list of tickets (with filtering, search, pagination)
export async function getGuildTickets(
  guildId: string,
  options?: {
    search?: string;
    status?: "all" | "closed" | "open";
    category?: string;
    page?: number;
    limit?: number;
  }
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await ensureServerAccess(guildId);

  const canView = await hasPermission(guildId, PERMISSIONS.VIEW_TICKETS);
  if (!canView) {
    throw new Error("You don't have permission to view tickets");
  }

  const limit = options?.limit ?? 50;
  const page = options?.page ?? 1;
  const skip = (page - 1) * limit;

  const where: Prisma.TicketAnalyticsWhereInput = {
    guildId,
  };

  if (options?.status === "closed") {
    where.closedAt = { not: null };
  } else if (options?.status === "open") {
    where.closedAt = null;
  }

  if (options?.category && options.category !== "all") {
    where.category = options.category;
  }

  if (options?.search && options.search.trim().length > 0) {
    const term = options.search.trim();
    where.OR = [
      { userName: { contains: term, mode: "insensitive" } },
      { userId: { contains: term } },
      { ticketId: { contains: term } },
      { category: { contains: term, mode: "insensitive" } },
    ];
  }

  const [tickets, totalCount] = await Promise.all([
    db.ticketAnalytics.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        guildId: true,
        ticketId: true,
        userId: true,
        userName: true,
        category: true,
        priority: true,
        aiHandled: true,
        aiResolved: true,
        escalated: true,
        escalationReason: true,
        messageCount: true,
        aiMessageCount: true,
        responseTime: true,
        createdAt: true,
        closedAt: true,
      },
    }),
    db.ticketAnalytics.count({ where }),
  ]);

  return { tickets, totalCount };
}

// Fetch complete message transcript for a specific ticket
export async function getTicketTranscript(guildId: string, ticketId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await ensureServerAccess(guildId);

  const canView = await hasPermission(guildId, PERMISSIONS.VIEW_TICKETS);
  if (!canView) {
    throw new Error("You don't have permission to view tickets");
  }

  const [ticket, messages] = await Promise.all([
    db.ticketAnalytics.findFirst({
      where: {
        guildId,
        ticketId,
      },
    }),
    db.ticketMessage.findMany({
      where: {
        guildId,
        ticketId,
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        ticketId: true,
        userId: true,
        userName: true,
        content: true,
        isAI: true,
        aiConfidence: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    ticket,
    messages,
  };
}

// Delete a ticket transcript archive (staff only)
export async function deleteTicketTranscript(guildId: string, ticketId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await ensureServerAccess(guildId);

  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_TICKETS);
  if (!canManage) {
    throw new Error("You don't have permission to manage tickets");
  }

  await Promise.all([
    db.ticketMessage.deleteMany({ where: { guildId, ticketId } }),
    db.ticketAnalytics.deleteMany({ where: { guildId, ticketId } }),
  ]);

  revalidatePath(`/dashboard/${guildId}/tickets`);
  return { success: true };
}

// Generate a sample ticket transcript for instant preview/testing
export async function createSampleTicketTranscript(guildId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await ensureServerAccess(guildId);
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_TICKETS);
  if (!canManage) throw new Error("You don't have permission to manage tickets");

  const sampleTicketId = `sample-${Date.now().toString().slice(-6)}`;
  const now = new Date();
  const openedAt = new Date(now.getTime() - 25 * 60 * 1000);
  const msg1At = new Date(openedAt.getTime() + 1 * 60 * 1000);
  const msg2At = new Date(openedAt.getTime() + 2 * 60 * 1000);
  const msg3At = new Date(openedAt.getTime() + 5 * 60 * 1000);
  const closedAt = now;

  await db.ticketAnalytics.create({
    data: {
      guildId,
      ticketId: sampleTicketId,
      userId: session.user.id || "123456789",
      userName: session.user.name || "SampleUser",
      category: "General Support",
      priority: "Normal",
      aiHandled: true,
      aiResolved: true,
      escalated: false,
      messageCount: 4,
      aiMessageCount: 1,
      responseTime: 5,
      createdAt: openedAt,
      closedAt,
    },
  });

  await db.ticketMessage.createMany({
    data: [
      {
        guildId,
        ticketId: sampleTicketId,
        userId: "system",
        userName: "🤖 Ticket System",
        content: `🎫 **Ticket opened** by ${session.user.name || "SampleUser"} for **General Support**.\nSupport will be with you shortly.`,
        isAI: false,
        createdAt: openedAt,
      },
      {
        guildId,
        ticketId: sampleTicketId,
        userId: session.user.id || "123456789",
        userName: session.user.name || "SampleUser",
        content: "Hey, I wanted to ask how I can join the Minecraft server? Where can I find the IP address?",
        isAI: false,
        createdAt: msg1At,
      },
      {
        guildId,
        ticketId: sampleTicketId,
        userId: "ai-assistant",
        userName: "🤖 AI Assistant",
        content: "Hey! You can find the server IP address in the **#server-ip** channel, or simply connect to **play.example.net** (Port: `25565`). Have fun playing!",
        isAI: true,
        aiConfidence: 98,
        createdAt: msg2At,
      },
      {
        guildId,
        ticketId: sampleTicketId,
        userId: session.user.id || "123456789",
        userName: session.user.name || "SampleUser",
        content: "Awesome, thank you so much! That worked perfectly. You can close this ticket now.",
        isAI: false,
        createdAt: msg3At,
      },
    ],
  });

  revalidatePath(`/dashboard/${guildId}/tickets`);
  return { success: true, ticketId: sampleTicketId };
}
