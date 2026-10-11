import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Zap, TrendingUp, Users, Award, Flame, MessageSquare, Trophy, Star, Target } from "lucide-react";
import Link from "next/link";
import { ModuleSwitch } from "@/components/ModuleSwitch";
import { LevelingConfig } from "@/components/LevelingConfig";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function LevelingModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({
    where: { discordId: id },
    include: {
      members: {
        orderBy: { xp: 'desc' },
        take: 10,
        include: { user: true }
      }
    }
  });

  if (!guild) redirect("/dashboard");

  let roles = [];
  let channels = [];
  try {
    const [rolesRes, channelsRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${id}/roles`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        next: { revalidate: 60 }
      }),
      fetch(`https://discord.com/api/v10/guilds/${id}/channels`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        next: { revalidate: 60 }
      })
    ]);
    if (rolesRes.ok) roles = await rolesRes.json();
    if (channelsRes.ok) channels = await channelsRes.json();
  } catch (e) {
    console.error("Failed to fetch guild data", e);
  }

  const totalMembers = guild.members.length;
  const totalXP = guild.members.reduce((sum, m) => sum + m.xp, 0);
  const totalMessages = guild.members.reduce((sum, m) => sum + (m.totalMessages || 0), 0);
  const activeStreaks = guild.members.filter(m => (m.currentStreak || 0) > 0).length;
  const averageLevel = totalMembers > 0
    ? Math.floor(guild.members.reduce((sum, m) => sum + m.level, 0) / totalMembers)
    : 0;
  const topStreaker = guild.members.length > 0
    ? guild.members.reduce((top, m) => (m.currentStreak || 0) > (top?.currentStreak || 0) ? m : top, guild.members[0])
    : null;

  const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="max-w-6xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Zap className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Leveling System
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Gamification with streaks, achievements, and role rewards.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <Users className="w-4 h-4" />, label: "MEMBERS", value: totalMembers.toLocaleString(), sub: "Active users" },
          { icon: <TrendingUp className="w-4 h-4" />, label: "TOTAL XP", value: totalXP.toLocaleString(), sub: "Server-wide experience" },
          { icon: <Target className="w-4 h-4" />, label: "AVG LEVEL", value: averageLevel.toString(), sub: "Average user level" },
          { icon: <Flame className="w-4 h-4" />, label: "STREAKS", value: activeStreaks.toString(), sub: topStreaker && (topStreaker.currentStreak || 0) > 0 ? `Top: ${topStreaker.currentStreak} days` : "No active streaks" },
          { icon: <MessageSquare className="w-4 h-4" />, label: "MESSAGES", value: totalMessages.toLocaleString(), sub: "Total messages sent" },
          { icon: <Award className="w-4 h-4" />, label: "REWARDS", value: String(Object.keys((guild.levelRewards as any) || {}).length), sub: "Role rewards configured" },
          { icon: <Trophy className="w-4 h-4" />, label: "ACHIEVEMENTS", value: "8", sub: "Unlockable badges" },
          { icon: <Star className="w-4 h-4" />, label: "XP RATE", value: "5-15", sub: "XP per message" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", color: "#F5F4F5" }}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#A8A9A2" }}>{stat.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#F5F4F5" }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: <Flame className="w-4 h-4" />, title: "Streak System", desc: "Users earn +5% bonus XP per day of consecutive activity (max +50% at 10 days)" },
          { icon: <Trophy className="w-4 h-4" />, title: "Achievements", desc: "Unlock 8 achievements for level milestones, streaks, and special actions with XP rewards" },
          { icon: <TrendingUp className="w-4 h-4" />, title: "3 Leaderboards", desc: "Compete for top XP, longest streaks, or most messages with beautiful rank cards" },
        ].map((f) => (
          <div key={f.title} className="p-4 rounded-2xl flex items-start gap-3" style={cardStyle}>
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", color: "#F5F4F5" }}>
              {f.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#A8A9A2" }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top 10 Leaderboard */}
      {totalMembers > 0 && (
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="flex items-center gap-2 p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Trophy className="w-4 h-4" style={{ color: "#1FA7BB" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Top 10 Members</h2>
          </div>
          <div>
            {guild.members.slice(0, 10).map((member, index) => {
              const medal = ['🥇', '🥈', '🥉'][index];
              const currentStreak = member.currentStreak || 0;
              const streakBonus = Math.min(50, (currentStreak - 1) * 5);
              const msgs = member.totalMessages || 0;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: index < 9 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base w-7 text-center">{medal || `${index + 1}.`}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>{member.user.username}</p>
                      <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "#A8A9A2" }}>
                        <span>Level {member.level}</span>
                        {currentStreak > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Flame className="w-3 h-3" style={{ color: "#F97316" }} />
                            {currentStreak}d
                          </span>
                        )}
                        {msgs > 0 && (
                          <span className="flex items-center gap-0.5">
                            <MessageSquare className="w-3 h-3" />
                            {msgs.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: "#F5F4F5" }}>{member.xp.toLocaleString()} XP</p>
                    {streakBonus > 0 && (
                      <p className="text-[10px] font-semibold" style={{ color: "#F97316" }}>+{streakBonus}% bonus</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enable Toggle */}
      <div className="p-5 rounded-2xl flex items-center justify-between" style={cardStyle}>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Leveling</h3>
          <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Users gain XP for messages, unlock achievements, build streaks, and earn role rewards</p>
        </div>
        <ModuleSwitch discordId={id} module="levelingEnabled" initialEnabled={guild.levelingEnabled} />
      </div>

      {/* Leveling Config */}
      <div className="p-5 rounded-2xl" style={cardStyle}>
        <LevelingConfig
          discordId={id}
          initialLevelUpChannelId={guild.levelUpChannelId}
          initialLevelRewards={guild.levelRewards as any}
          serverRoles={roles}
        />
      </div>

      {/* Commands */}
      <div className="p-5 rounded-2xl" style={cardStyle}>
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: "#F5F4F5" }}>
          <Zap className="w-4 h-4" style={{ color: "#1FA7BB" }} /> Available Commands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { cmd: "/rank [@user]", desc: "View rank card with level, XP, streak, messages, and achievements" },
            { cmd: "/leaderboard [type]", desc: "View top 10: xp, streak, or messages" },
            { cmd: "/achievements [@user]", desc: "View all 8 achievements and unlock progress" },
          ].map((c) => (
            <div key={c.cmd} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <code className="text-sm font-mono font-semibold block mb-2" style={{ color: "#1FA7BB" }}>{c.cmd}</code>
              <p className="text-sm" style={{ color: "#F5F4F5", opacity: 0.7 }}>{c.desc}</p>
            </div>
          ))}
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Flame className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#F97316" }} />
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>Automatic Tracking</p>
              <p className="text-sm" style={{ color: "#F5F4F5", opacity: 0.7 }}>XP, streaks, messages, and achievements update automatically</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
