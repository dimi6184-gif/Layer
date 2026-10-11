import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@nexus/db";
import { verifyGuildAccess, AccessDeniedError } from "@/lib/db-access-control";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      discordId,
      threshold,
      action,
      logChannelId,
      deleteChannelIds,
      whitelistRoleIds,
      requireLabel,
    } = body;

    // 🔒 SECURITY: Verify user has admin access to this guild
    await verifyGuildAccess(discordId, session.user.id, { requireAdmin: true });

    // Update guild settings
    await db.guild.update({
      where: { discordId },
      data: {
        aiDetectionThreshold: threshold,
        aiDetectionAction: action,
        aiDetectionLogChannelId: logChannelId || null,
        aiDetectionDeleteChannelIds: deleteChannelIds,
        aiDetectionWhitelistRoleIds: whitelistRoleIds,
        aiDetectionRequireLabel: requireLabel,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.error("Error updating AI detection settings:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
