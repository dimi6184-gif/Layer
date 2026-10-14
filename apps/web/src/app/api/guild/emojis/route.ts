import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guildId = request.nextUrl.searchParams.get("guildId");
  if (!guildId) {
    return NextResponse.json({ error: "Missing guildId" }, { status: 400 });
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

    // Return id, name, animated so the client can build the CDN URL
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
