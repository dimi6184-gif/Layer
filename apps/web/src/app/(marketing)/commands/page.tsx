'use client';

import { useState } from "react";
import { Shield, Music, Trophy, Gift, Sparkles, MessageSquare } from "lucide-react";

const categories = [
  {
    id: 'moderation',
    name: 'Moderation',
    icon: Shield,
    commands: [
      { name: '/ban', description: 'Permanently ban a user from the server.', usage: '/ban @user [reason]' },
      { name: '/kick', description: 'Kick a user from the server.', usage: '/kick @user [reason]' },
      { name: '/mute', description: 'Temporarily mute a user.', usage: '/mute @user [duration]' },
      { name: '/warn', description: 'Issue a formal warning to a user.', usage: '/warn @user [reason]' },
      { name: '/warnings', description: 'View all warnings for a user.', usage: '/warnings @user' },
      { name: '/clear', description: 'Bulk delete messages in a channel.', usage: '/clear [amount]' },
    ],
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    commands: [
      { name: '/play', description: 'Play a song from YouTube by name or URL.', usage: '/play [song]' },
      { name: '/pause', description: 'Pause the current song.', usage: '/pause' },
      { name: '/resume', description: 'Resume paused playback.', usage: '/resume' },
      { name: '/skip', description: 'Skip to the next song in the queue.', usage: '/skip' },
      { name: '/stop', description: 'Stop playback and clear the queue.', usage: '/stop' },
      { name: '/queue', description: 'View the current song queue.', usage: '/queue' },
      { name: '/volume', description: 'Set the playback volume.', usage: '/volume [0-100]' },
    ],
  },
  {
    id: 'leveling',
    name: 'Leveling',
    icon: Trophy,
    commands: [
      { name: '/rank', description: 'View your level, XP, streak, and achievements.', usage: '/rank [@user]' },
      { name: '/leaderboard', description: 'View the top members by XP, streak, or messages.', usage: '/leaderboard [type]' },
      { name: '/achievements', description: 'View all 8 achievements and your unlock progress.', usage: '/achievements [@user]' },
    ],
  },
  {
    id: 'fun',
    name: 'Fun',
    icon: Gift,
    commands: [
      { name: '/giveaway', description: 'Create a giveaway in a channel.', usage: '/giveaway create' },
      { name: '/poll', description: 'Create a poll with up to 4 options.', usage: '/poll [question]' },
    ],
  },
  {
    id: 'ai',
    name: 'AI',
    icon: Sparkles,
    commands: [
      { name: '/ask', description: 'Ask Layer AI any question.', usage: '/ask [question]' },
      { name: '/setup', description: 'Run the guided AI-powered server setup.', usage: '/setup' },
    ],
  },
  {
    id: 'utility',
    name: 'Utility',
    icon: MessageSquare,
    commands: [
      { name: '/serverinfo', description: 'View detailed information about this server.', usage: '/serverinfo' },
      { name: '/userinfo', description: 'View detailed information about a user.', usage: '/userinfo [@user]' },
      { name: '/ticket', description: 'Open or manage a support ticket.', usage: '/ticket panel' },
      { name: '/verification', description: 'Send the verification panel to a channel.', usage: '/verification setup' },
    ],
  },
];

const total = categories.reduce((s, c) => s + c.commands.length, 0);

export default function CommandsPage() {
  const [active, setActive] = useState('moderation');
  const current = categories.find(c => c.id === active)!;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1.5" style={{ color: "#F5F4F5" }}>
          Bot Commands
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          {total} commands across {categories.length} categories.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
                isActive ? "text-white" : "text-white/40 hover:text-white"
              }`}
              style={isActive
                ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }
                : { background: "transparent", border: "1px solid transparent" }
              }
            >
              <Icon size={12} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Commands list — clean table style like Honeypot */}
      <div className="space-y-0">
        {current.commands.map((cmd, i) => (
          <div
            key={cmd.name}
            className="py-5"
            style={{ borderBottom: i < current.commands.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
          >
            <div className="flex items-start gap-8">
              {/* Command name */}
              <code
                className="text-sm font-mono font-medium flex-shrink-0 w-36"
                style={{ color: "#1FA7BB" }}
              >
                {cmd.name}
              </code>

              {/* Description + usage */}
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {cmd.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Usage</span>
                  <code
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }}
                  >
                    {cmd.usage}
                  </code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-xs pt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
        {current.commands.length} command{current.commands.length !== 1 ? "s" : ""} in {current.name}
      </p>
    </div>
  );
}
