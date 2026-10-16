export const dynamic = 'force-dynamic';
import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Music } from "lucide-react";
import Link from "next/link";
import { ModuleSwitch } from "@/components/ModuleSwitch";
import { MusicConfig } from "@/components/MusicConfig";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function MusicModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({ where: { discordId: id } });
  if (!guild) redirect("/dashboard");

  let roles = [];
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${id}/roles`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      next: { revalidate: 60 }
    });
    if (res.ok) roles = await res.json();
  } catch (e) {
    console.error("Failed to fetch roles", e);
  }

  const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Music className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Music Player
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>High quality audio playback and queue system.</p>
        </div>
      </div>

      {/* Enable toggle */}
      <div className="p-5 rounded-2xl flex items-center justify-between" style={cardStyle}>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Music</h3>
          <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Allows users to play music in voice channels using Layer.</p>
        </div>
        <ModuleSwitch discordId={id} module="musicEnabled" initialEnabled={guild!.musicEnabled} />
      </div>

      {/* Config */}
      <div className="p-5 rounded-2xl" style={cardStyle}>
        <MusicConfig
          discordId={id}
          initialDjRoleIds={guild!.djRoleIds}
          serverRoles={roles}
        />
      </div>

      {/* Commands */}
      <div className="p-5 rounded-2xl" style={cardStyle}>
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: "#F5F4F5" }}>
          <Music className="w-4 h-4" style={{ color: "#1FA7BB" }} /> Available Commands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { cmd: "/play [song]", desc: "Play a song from YouTube by name or URL" },
            { cmd: "/queue", desc: "View the current song queue" },
            { cmd: "/skip", desc: "Skip the current song" },
            { cmd: "/pause / /resume", desc: "Pause or resume playback" },
            { cmd: "/stop", desc: "Stop playback and clear the queue" },
            { cmd: "/volume [0-100]", desc: "Adjust the playback volume" },
          ].map((c) => (
            <div key={c.cmd} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <code className="text-sm font-mono font-semibold block mb-1.5" style={{ color: "#1FA7BB" }}>{c.cmd}</code>
              <p className="text-sm" style={{ color: "#F5F4F5", opacity: 0.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
