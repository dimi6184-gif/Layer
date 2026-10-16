export const dynamic = 'force-dynamic';
import { ensureServerAccess } from "@/lib/ensure-access";
import { db } from "@nexus/db";
import { BarChart3, Users, TrendingUp, Calendar, Smile, ArrowLeft } from "lucide-react";
import { PollEmojiSettings } from "@/components/PollEmojiSettings";
import Link from "next/link";

export default async function PollsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({
    where: { discordId: id },
    select: { customPollEmojis: true },
  });

  if (!guild) return <div>Guild not found</div>;

  const polls = await db.poll.findMany({
    where: { guildId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalPolls = polls.length;
  const activePolls = polls.filter(p => !p.ended).length;
  const totalVotes = polls.reduce((sum, poll) => {
    const votes = poll.votes as Array<{ option: string; userIds: string[] }>;
    return sum + votes.reduce((vs, v) => vs + v.userIds.length, 0);
  }, 0);

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
            <BarChart3 className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Poll Analytics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Track and analyze all polls in your server.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <BarChart3 className="w-4 h-4" />, label: "Total Polls", value: totalPolls },
          { icon: <TrendingUp className="w-4 h-4" />, label: "Active Polls", value: activePolls },
          { icon: <Users className="w-4 h-4" />, label: "Total Votes", value: totalVotes },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl" style={cardStyle}>
            <div className="p-1.5 rounded-lg w-fit mb-3" style={{ background: "rgba(255,255,255,0.06)", color: "#F5F4F5" }}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold" style={{ color: "#F5F4F5" }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Emoji Settings */}
      <div className="p-5 rounded-2xl" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Smile className="w-4 h-4" style={{ color: "#1FA7BB" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Poll Emoji Settings</h2>
        </div>
        <PollEmojiSettings guildId={id} initialPollEmojis={guild.customPollEmojis} />
      </div>

      {/* Polls List */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Calendar className="w-4 h-4" style={{ color: "#1FA7BB" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Recent Polls</h2>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-8 h-8 mx-auto mb-3" style={{ color: "#A8A9A2" }} />
            <p className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>No polls yet</p>
            <p className="text-xs" style={{ color: "#A8A9A2" }}>
              Create your first poll with{" "}
              <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}>/poll</code>
            </p>
          </div>
        ) : (
          <div>
            {polls.map((poll, i) => {
              const votes = poll.votes as Array<{ option: string; userIds: string[] }>;
              const totalPollVotes = votes.reduce((s, v) => s + v.userIds.length, 0);

              return (
                <div
                  key={poll.id}
                  className="px-5 py-4 transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: i < polls.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  {/* Poll header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate" style={{ color: "#F5F4F5" }}>{poll.question}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs" style={{ color: "#A8A9A2" }}>
                        <span>{poll.creatorName}</span>
                        <span>·</span>
                        <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{totalPollVotes} votes</span>
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0"
                      style={poll.ended
                        ? { background: "rgba(255,255,255,0.06)", color: "#A8A9A2" }
                        : { background: "rgba(34,197,94,0.1)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.2)" }
                      }
                    >
                      {poll.ended ? "Ended" : "Active"}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {poll.options.map((option, idx) => {
                      const voteCount = votes[idx]?.userIds.length || 0;
                      const pct = totalPollVotes > 0 ? (voteCount / totalPollVotes) * 100 : 0;
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span style={{ color: "#F5F4F5" }}>{option}</span>
                            <span style={{ color: "#A8A9A2" }}>{voteCount} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: "#1FA7BB" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <a
                    href={`https://discord.com/channels/${poll.guildId}/${poll.channelId}/${poll.messageId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs transition-colors hover:opacity-80"
                    style={{ color: "#1FA7BB" }}
                  >
                    View in Discord
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
