export const dynamic = 'force-dynamic';
import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import { ModuleSwitch } from "@/components/ModuleSwitch";
import { TicketPageTabs } from "@/components/TicketPageTabs";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function TicketsModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({ where: { discordId: id } });
  if (!guild) redirect("/dashboard");

  let roles: { id: string; name: string; color: number }[] = [];
  let categories: { id: string; name: string }[] = [];
  let textChannels: { id: string; name: string }[] = [];

  try {
    const [rolesRes, channelsRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${id}/roles`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        next: { revalidate: 60 },
      }),
      fetch(`https://discord.com/api/v10/guilds/${id}/channels`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        next: { revalidate: 60 },
      }),
    ]);

    if (rolesRes.ok) roles = await rolesRes.json();
    if (channelsRes.ok) {
      const allChannels = await channelsRes.json();
      categories = (allChannels as any[])
        .filter((c: any) => c.type === 4)
        .map((c: any) => ({ id: c.id, name: c.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
      textChannels = (allChannels as any[])
        .filter((c: any) => c.type === 0)
        .map((c: any) => ({ id: c.id, name: c.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch (e) {
    console.error("Failed to fetch Discord data", e);
  }

  const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Ticket className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Ticket System
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Let users open private support tickets directly in Discord.</p>
        </div>
      </div>

      {/* Enable toggle */}
      <div className="p-5 rounded-2xl flex items-center justify-between" style={cardStyle}>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Ticket System</h3>
          <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Users can click a button in Discord to open a private support channel.</p>
        </div>
        <ModuleSwitch discordId={id} module="ticketsEnabled" initialEnabled={guild!.ticketsEnabled} />
      </div>

      {/* Tabbed config */}
      <TicketPageTabs
        discordId={id}
        guild={guild}
        categories={categories}
        roles={roles}
        textChannels={textChannels}
      />

    </div>
  );
}
