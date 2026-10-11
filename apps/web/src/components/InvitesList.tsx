"use client";

import { useState } from "react";
import { Crown, Shield, Eye, Users, Settings, Sparkles } from "lucide-react";
import { acceptTeamInvite, declineTeamInvite } from "@/actions/team";
import { ROLE_PRESETS } from "@/lib/team-permissions";

interface Invite {
  id: string;
  guildId: string;
  role: string;
  createdAt: Date;
  inviterName: string | null;
  guild: {
    discordId: string;
    name: string;
  };
}

interface InvitesListProps {
  invites: Invite[];
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  moderator: Shield,
  event_manager: Users,
  support: Users,
  viewer: Eye,
  custom: Settings,
};

const roleColors = {
  owner: "text-yellow-600",
  admin: "text-red-600",
  moderator: "text-blue-600",
  event_manager: "text-yellow-600",
  support: "text-green-600",
  viewer: "text-gray-600",
  custom: "text-yellow-600",
};

export function InvitesList({ invites }: InvitesListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAccept = async (guildId: string) => {
    setLoading(guildId);
    setError("");
    try {
      await acceptTeamInvite(guildId);
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation");
    } finally {
      setLoading(null);
    }
  };

  const handleDecline = async (guildId: string) => {
    if (!confirm("Decline this invitation?")) return;
    
    setLoading(guildId);
    setError("");
    try {
      await declineTeamInvite(guildId);
    } catch (err: any) {
      setError(err.message || "Failed to decline invitation");
    } finally {
      setLoading(null);
    }
  };

  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 text-sm">No pending invitations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {invites.map((invite) => {
        const RoleIcon = roleIcons[invite.role as keyof typeof roleIcons] || Users;
        const roleColor = roleColors[invite.role as keyof typeof roleColors] || roleColors.viewer;
        const rolePreset = ROLE_PRESETS[invite.role as keyof typeof ROLE_PRESETS];

        return (
          <div
            key={invite.id}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 hover:border-yellow-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left: Server Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold truncate text-lg">{invite.guild.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <RoleIcon className={`w-3.5 h-3.5 ${roleColor}`} />
                    <span className={`text-sm font-semibold ${roleColor}`}>{rolePreset?.name || invite.role}</span>
                    {invite.inviterName && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-500">by {invite.inviterName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAccept(invite.guildId)}
                  disabled={loading === invite.guildId}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-semibold rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(invite.guildId)}
                  disabled={loading === invite.guildId}
                  className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 text-sm font-semibold rounded-2xl transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
