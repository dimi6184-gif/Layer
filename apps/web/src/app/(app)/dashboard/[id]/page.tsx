import {
  Users,
  MessageSquare,
  Command,
  Bot,
  Shield,
  Zap,
  Music,
  Activity,
  ArrowRight,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function ServerDashboardOverview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await ensureServerAccess(id);

  const [guild, discordGuild, todayStats] = await Promise.all([
    db.guild.findUnique({
      where: { discordId: id },
      select: {
        discordId: true,
        name: true,
        aiEnabled: true,
        moderationEnabled: true,
        antiScamEnabled: true,
        levelingEnabled: true,
        musicEnabled: true,
        verificationEnabled: true,
        _count: { select: { members: true } }
      }
    }),

    fetch(`https://discord.com/api/guilds/${id}?with_counts=true`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      next: { revalidate: 60 }
    }).then(res => res.ok ? res.json() : null),

    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const logs = await db.auditLog.findMany({
        where: { guildId: id, createdAt: { gte: today } },
        select: { action: true, metadata: true },
      });
      let messagesToday = 0, commandsToday = 0, aiTokensToday = 0;
      for (const log of logs) {
        if (log.action === 'MESSAGE_SENT') messagesToday++;
        else if (log.action === 'COMMAND_EXECUTED') commandsToday++;
        else if (log.action === 'AI_TOKENS_USED') aiTokensToday += (log.metadata as any)?.tokens || 0;
      }
      return { messagesToday, commandsToday, aiTokensToday };
    })(),
  ]);

  if (!discordGuild) redirect("/dashboard");

  let finalGuild = guild;
  if (!finalGuild) {
    finalGuild = await db.guild.create({
      data: { discordId: discordGuild.id, name: discordGuild.name },
      select: {
        discordId: true, name: true, aiEnabled: true, moderationEnabled: true,
        antiScamEnabled: true, levelingEnabled: true, musicEnabled: true,
        verificationEnabled: true, _count: { select: { members: true } }
      }
    });
  }

  const serverName = discordGuild.name || finalGuild.name;
  const iconUrl = discordGuild.icon
    ? `https://cdn.discordapp.com/icons/${discordGuild.id}/${discordGuild.icon}.png?size=256`
    : null;
  const memberCount = discordGuild.approximate_member_count || finalGuild._count?.members || 0;

  const recentActivity = await db.auditLog.findMany({
    where: { guildId: id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, action: true, userName: true, details: true, createdAt: true },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Server Header */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{ background: "#121315", border: "1px solid rgba(31,167,187,0.15)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-bold overflow-hidden"
          style={{ background: "#174F49", color: "#F5F4F5" }}
        >
          {iconUrl
            ? <img src={iconUrl} alt={serverName} className="w-full h-full object-cover" />
            : serverName.charAt(0).toUpperCase()
          }
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#F5F4F5" }}>{serverName}</h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Layer is connected and actively monitoring this server.</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#1FA7BB" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#1FA7BB" }} />
          </span>
          <span className="text-xs font-semibold" style={{ color: "#1FA7BB" }}>Online</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Members" value={memberCount.toString()} icon={<Users className="w-4 h-4" />} />
        <StatCard title="Messages Today" value={todayStats.messagesToday.toString()} icon={<MessageSquare className="w-4 h-4" />} />
        <StatCard title="Commands" value={todayStats.commandsToday.toString()} icon={<Command className="w-4 h-4" />} />
        <StatCard title="AI Tokens" value={todayStats.aiTokensToday.toString()} icon={<Bot className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#A8A9A2" }}>Active Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ModuleCard title="Layer AI" description="Smart auto-responses and /ask command." icon={<Bot className="w-5 h-5" />} active={finalGuild.aiEnabled} href={`/dashboard/${id}/ai`} />
            <ModuleCard title="Auto Moderation" description="Anti-spam, auto-warns, filter rules." icon={<Shield className="w-5 h-5" />} active={finalGuild.moderationEnabled} href={`/dashboard/${id}/moderation`} />
            <ModuleCard title="Anti-Scam" description="AI-powered scam and phishing detection." icon={<ShieldAlert className="w-5 h-5" />} active={finalGuild.antiScamEnabled} href={`/dashboard/${id}/anti-scam`} />
            <ModuleCard title="Leveling" description="XP, ranks, and role rewards." icon={<Zap className="w-5 h-5" />} active={finalGuild.levelingEnabled} href={`/dashboard/${id}/leveling`} />
            <ModuleCard title="Music" description="High quality audio playback and queue." icon={<Music className="w-5 h-5" />} active={finalGuild.musicEnabled} href={`/dashboard/${id}/music`} />
            <ModuleCard title="Verification" description="CAPTCHA and custom verification flows." icon={<ShieldCheck className="w-5 h-5" />} active={finalGuild.verificationEnabled} href={`/dashboard/${id}/verification`} />
            <ModuleCard title="Advanced Mod" description="Avatar tracking, impersonation detection." icon={<Shield className="w-5 h-5" />} active={true} href={`/dashboard/${id}/advanced-mod`} badge="NEW" />
          </div>
        </div>

        {/* Activity */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#A8A9A2" }}>Recent Activity</h2>
          <div className="rounded-2xl p-4" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Activity className="w-6 h-6 mb-3" style={{ color: "#A8A9A2" }} />
                <p className="text-sm" style={{ color: "#A8A9A2" }}>No recent activity yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentActivity.map((log) => (
                  <ActivityItem key={log.id} log={log} />
                ))}
              </div>
            )}
            <Link
              href={`/dashboard/${id}/logs`}
              className="block w-full mt-4 py-2 text-xs font-semibold text-center rounded-xl transition-colors"
              style={{ background: "rgba(31,167,187,0.08)", color: "#1FA7BB" }}
            >
              View All Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", color: "#F5F4F5" }}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight" style={{ color: "#F5F4F5" }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: "#A8A9A2" }}>{title}</div>
    </div>
  );
}

function ModuleCard({ title, description, icon, active, href, badge }: {
  title: string; description: string; icon: React.ReactNode;
  active: boolean; href: string; badge?: string;
}) {
  return (
    <Link href={href} className="block group">
      <div
        className="rounded-2xl p-5 h-full transition-all duration-200"
        style={{
          background: "#121315",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", color: "#F5F4F5" }}>
            {icon}
          </div>
          {badge ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}>
              {badge}
            </span>
          ) : active ? (
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#1FA7BB" }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#1FA7BB" }} />
              </span>
              <span className="text-[10px] font-semibold" style={{ color: "#1FA7BB" }}>Active</span>
            </div>
          ) : (
            <span className="text-[10px] font-semibold" style={{ color: "#A8A9A2" }}>Off</span>
          )}
        </div>

        <h3 className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>{title}</h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "#A8A9A2" }}>{description}</p>

        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#1FA7BB" }}>
          Configure
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ log }: { log: { action: string; userName: string | null; details: string; createdAt: Date } }) {
  const getIcon = (action: string) => {
    switch (action) {
      case 'COMMAND_EXECUTED': return <Command className="w-3.5 h-3.5" style={{ color: "#F5F4F5" }} />;
      case 'MESSAGE_SENT': return <MessageSquare className="w-3.5 h-3.5" style={{ color: "#F5F4F5" }} />;
      case 'AI_TOKENS_USED': return <Bot className="w-3.5 h-3.5" style={{ color: "#F5F4F5" }} />;
      default: return <Activity className="w-3.5 h-3.5" style={{ color: "#F5F4F5" }} />;
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", color: "#F5F4F5" }}>
        {getIcon(log.action)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "#F5F4F5" }}>{log.details}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#A8A9A2" }}>
          {log.userName || 'System'} · {timeAgo(log.createdAt)}
        </p>
      </div>
    </div>
  );
}
