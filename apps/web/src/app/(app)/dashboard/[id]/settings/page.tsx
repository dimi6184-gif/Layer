import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { ServerSettings } from "@/components/ServerSettings";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({
    where: { discordId: id },
  });

  if (!guild) {
    redirect("/dashboard");
  }

  let channels: { id: string; name: string }[] = [];

  try {
    const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${id}/channels`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      next: { revalidate: 60 },
    });

    if (channelsRes.ok) {
      const allChannels = await channelsRes.json();
      // Type 0 = Text channel, 5 = Announcement channel
      channels = (allChannels as any[])
        .filter((c: any) => c.type === 0 || c.type === 5)
        .map((c: any) => ({ id: c.id, name: c.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch (e) {
    console.error("Failed to fetch Discord channels for settings page", e);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Settings className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Server Settings
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Configure the moderation log channel for your server.</p>
        </div>
      </div>

      <ServerSettings
        discordId={id}
        initialLogChannelId={guild.logChannelId}
        serverChannels={channels}
      />
    </div>
  );
}
