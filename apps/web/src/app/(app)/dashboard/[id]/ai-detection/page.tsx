import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ensureServerAccess } from "@/lib/ensure-access";
import { fetchGuildChannels } from "@/lib/discord-channels";
import { ArrowLeft, Bot, Image as ImageIcon, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ModuleSwitch } from "@/components/ModuleSwitch";
import { AIDetectionConfig } from "@/components/AIDetectionConfig";

export default async function AIDetectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({
    where: { discordId: id },
    select: {
      aiImageDetectionEnabled: true,
      aiDetectionThreshold: true,
      aiDetectionAction: true,
      aiDetectionLogChannelId: true,
      aiDetectionDeleteChannelIds: true,
      aiDetectionWhitelistRoleIds: true,
      aiDetectionRequireLabel: true,
    }
  });

  if (!guild) redirect("/dashboard");

  const channels = await fetchGuildChannels(id);
  const textChannels = channels.filter((c: any) => c.type === 0 || c.type === 5);

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

  const recentDetections = 0;
  const highConfidenceDetections = 0;

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Bot className="w-5 h-5" style={{ color: "#1FA7BB" }} /> AI Image Detection
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Automatically detect AI-generated images in your server.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-5 rounded-2xl" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
              <ImageIcon className="w-4 h-4" style={{ color: "#F5F4F5" }} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Last 7 days</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#F5F4F5" }}>{recentDetections}</p>
          <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>Images scanned</p>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
              <AlertTriangle className="w-4 h-4" style={{ color: "#F97316" }} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#A8A9A2" }}>High confidence</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#F5F4F5" }}>{highConfidenceDetections}</p>
          <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>Likely AI-generated (≥80%)</p>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="flex items-start gap-4 p-5 rounded-2xl"
        style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}
      >
        <div className="p-2 rounded-xl flex-shrink-0" style={{ background: "rgba(31,167,187,0.15)" }}>
          <Bot className="w-4 h-4" style={{ color: "#1FA7BB" }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: "#1FA7BB" }}>How does it work?</h3>
          <p className="text-xs leading-relaxed" style={{ color: "#A8A9A2" }}>
            Layer automatically analyzes all images in configured channels using image detection technology.
            Detected AI images can be deleted, logged, or flagged with a warning.
            Perfect for servers with "No AI" rules.
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div
        className="p-5 rounded-2xl flex items-center justify-between"
        style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable AI Image Detection</h3>
          <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Automatically detect AI-generated images in selected channels.</p>
        </div>
        <ModuleSwitch
          discordId={id}
          module="aiImageDetectionEnabled"
          initialEnabled={guild.aiImageDetectionEnabled || false}
        />
      </div>

      {/* Config */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <AIDetectionConfig
          discordId={id}
          initialThreshold={guild.aiDetectionThreshold || 70}
          initialAction={guild.aiDetectionAction || 'log'}
          initialLogChannelId={guild.aiDetectionLogChannelId || ''}
          initialDeleteChannelIds={guild.aiDetectionDeleteChannelIds || []}
          initialWhitelistRoleIds={guild.aiDetectionWhitelistRoleIds || []}
          initialRequireLabel={guild.aiDetectionRequireLabel || false}
          channels={textChannels.map((c: any) => ({ id: c.id, name: c.name }))}
          roles={roles.map((r: any) => ({ id: r.id, name: r.name }))}
        />
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            icon: <CheckCircle className="w-4 h-4" style={{ color: "#1FA7BB" }} />,
            title: "Automatic Detection",
            desc: "Scans all images in real time as they are posted.",
          },
          {
            icon: <AlertTriangle className="w-4 h-4" style={{ color: "#F97316" }} />,
            title: "Confidence Score",
            desc: "Shows how likely an image is AI-generated (0–100%).",
          },
          {
            icon: <ImageIcon className="w-4 h-4" style={{ color: "#1FA7BB" }} />,
            title: "Flexible Actions",
            desc: "Delete, log, or warn — you decide what happens.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-2xl"
            style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="p-1.5 rounded-lg w-fit mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
              {item.icon}
            </div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>{item.title}</h3>
            <p className="text-xs" style={{ color: "#A8A9A2" }}>{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
