import { Plus, Server, Users } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@nexus/db";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id as string;
  const accessToken = (session.user as any).accessToken;

  if (!accessToken) redirect("/login");

  // 1. Fetch Discord guilds where user has ManageGuild/Admin
  const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!discordRes.ok) redirect("/api/auth/signin");

  const allDiscordGuilds: DiscordGuild[] = await discordRes.json();

  const MANAGE_GUILD = 0x20n;
  const ADMINISTRATOR = 0x8n;

  const adminGuilds = allDiscordGuilds.filter((g) => {
    const perms = BigInt(g.permissions);
    return g.owner || (perms & MANAGE_GUILD) === MANAGE_GUILD || (perms & ADMINISTRATOR) === ADMINISTRATOR;
  });

  // 2. Fetch servers where user is an invited team member (not owner)
  const teamMemberships = await db.teamMember.findMany({
    where: { userId, status: "active", role: { not: "owner" } },
    include: { guild: { select: { discordId: true, name: true } } },
  });

  // Fetch icons for invited servers via bot API
  const invitedServers = await Promise.all(
    teamMemberships.map(async (m) => {
      let icon: string | null = null;
      let name = m.guild.name;
      try {
        const r = await fetch(`https://discord.com/api/v10/guilds/${m.guild.discordId}`, {
          headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
          next: { revalidate: 60 },
        });
        if (r.ok) {
          const data = await r.json();
          name = data.name || name;
          if (data.icon) icon = `https://cdn.discordapp.com/icons/${m.guild.discordId}/${data.icon}.png?size=64`;
        }
      } catch {}
      return { id: m.guild.discordId, name, icon, role: m.role, isInvited: true };
    })
  );

  // 3. Bot guilds for "Layer is active" detection
  const botRes = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    cache: "no-store",
  });
  const botGuilds: DiscordGuild[] = botRes.ok ? await botRes.json() : [];
  const botGuildIds = new Set(botGuilds.map((g) => g.id));

  // 4. Merge — admin guilds first, then invited (deduplicate)
  const adminGuildIds = new Set(adminGuilds.map((g) => g.id));
  const uniqueInvited = invitedServers.filter((s) => !adminGuildIds.has(s.id));

  const adminCards = adminGuilds.map((g) => ({
    id: g.id,
    name: g.name,
    icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
    active: botGuildIds.has(g.id),
    isInvited: false,
    role: "owner" as string,
  }));

  const invitedCards = uniqueInvited.map((s) => ({
    id: s.id,
    name: s.name,
    icon: s.icon,
    active: botGuildIds.has(s.id),
    isInvited: true,
    role: s.role,
  }));

  const allCards = [...adminCards, ...invitedCards];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1" style={{ color: "#F5F4F5" }}>Select a Server</h1>
          <p className="text-sm" style={{ color: "#A8A9A2" }}>Choose a server to configure Layer.</p>
        </div>
        <Link
          href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&permissions=8&scope=bot%20applications.commands`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          <Plus size={14} />
          Invite Bot
        </Link>
      </div>

      {allCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
            <Server className="w-5 h-5" style={{ color: "#A8A9A2" }} />
          </div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "#F5F4F5" }}>No servers found</h3>
          <p className="text-sm max-w-sm" style={{ color: "#A8A9A2" }}>
            You don't have manage permissions for any Discord servers, and you haven't been invited to any dashboards yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCards.map((card) => (
            <ServerCard key={card.id} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}

function ServerCard({
  id, name, icon, active, isInvited, role,
}: {
  id: string; name: string; icon: string | null;
  active: boolean; isInvited: boolean; role: string;
}) {
  const href = active
    ? `/dashboard/${id}`
    : `https://discord.com/api/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${id}&disable_guild_select=true`;

  const LinkComponent = active ? Link : "a";

  // Friendly role label
  const roleLabel = role === "co_owner" ? "Co-Owner"
    : role === "admin" ? "Admin"
    : role === "moderator" ? "Moderator"
    : role === "support" ? "Support"
    : role === "viewer" ? "Viewer"
    : role;

  return (
    <LinkComponent
      href={href}
      {...(!active ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block group"
    >
      <div
        className="p-5 rounded-2xl flex items-center gap-4 transition-all duration-200 hover:scale-[1.02]"
        style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 overflow-hidden"
          style={{
            background: active ? "rgba(31,167,187,0.15)" : "rgba(255,255,255,0.06)",
            color: "#F5F4F5",
          }}
        >
          {icon
            ? <img src={icon} alt={name} className="w-full h-full object-cover" />
            : <span>{name.charAt(0).toUpperCase()}</span>
          }
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: "#F5F4F5" }}>{name}</h3>

          {active ? (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#1FA7BB" }}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#1FA7BB" }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#1FA7BB" }} />
                </span>
                Layer is active
              </span>
              {/* Team member badge */}
              {isInvited && (
                <span
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#A8A9A2" }}
                >
                  <Users size={9} />
                  {roleLabel}
                </span>
              )}
            </div>
          ) : (
            <span className="flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: "#A8A9A2" }}>
              <Plus size={11} /> Add Bot
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#A8A9A2" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </LinkComponent>
  );
}
