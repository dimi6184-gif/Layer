import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@nexus/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guildId = request.nextUrl.searchParams.get("guildId");
  if (!guildId) {
    return NextResponse.json({ error: "Missing guildId" }, { status: 400 });
  }

  // SECURITY: Verify the user is an active member of this guild
  const teamMember = await db.teamMember.findFirst({
    where: {
      guildId,
      userId: session.user.id,
      status: "active",
    },
    select: { role: true },
  });

  if (!teamMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/emojis`,
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ emojis: [] });
    }

    const emojis = await res.json();

    const mapped = emojis.map((e: any) => ({
      id: e.id,
      name: e.name,
      animated: e.animated ?? false,
    }));

    return NextResponse.json({ emojis: mapped });
  } catch {
    return NextResponse.json({ emojis: [] });
  }
}
