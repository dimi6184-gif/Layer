"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Shield, Eye, Users, Settings, Inbox, Check, X } from "lucide-react";
import { acceptTeamInvite, declineTeamInvite } from "@/actions/team";
import { ROLE_PRESETS } from "@/lib/team-permissions";

interface Invite {
  id: string;
  guildId: string;
  role: string;
  createdAt: Date;
  inviterName: string | null;
  guildIcon?: string | null;
  guildName?: string;
  guild: {
    discordId: string;
    name: string;
  };
}

interface InvitesListProps {
  invites: Invite[];
}

const roleStyles: Record<string, { icon: any; color: string; bg: string }> = {
  owner:         { icon: Crown,    color: "#EAB308", bg: "rgba(234,179,8,0.12)" },
  co_owner:      { icon: Crown,    color: "#EAB308", bg: "rgba(234,179,8,0.12)" },
  admin:         { icon: Shield,   color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  moderator:     { icon: Shield,   color: "#1FA7BB", bg: "rgba(31,167,187,0.12)" },
  event_manager: { icon: Users,    color: "#A855F7", bg: "rgba(168,85,247,0.12)" },
  support:       { icon: Users,    color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  viewer:        { icon: Eye,      color: "#A8A9A2", bg: "rgba(168,169,162,0.12)" },
  custom:        { icon: Settings, color: "#F97316", bg: "rgba(249,115,22,0.12)" },
};

export function InvitesList({ invites }: InvitesListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAccept = async (guildId: string) => {
    setLoading(guildId);
    setError("");
    try {
      await acceptTeamInvite(guildId);
      // Redirect to the server dashboard after accepting
      router.push(`/dashboard/${guildId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation");
      setLoading(null);
    }
  };

  const handleDecline = async (guildId: string) => {
    if (!confirm("Decline this invitation?")) return;
    setLoading(guildId);
    setError("");
    try {
      await declineTeamInvite(guildId);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to decline invitation");
    } finally {
      setLoading(null);
    }
  };

  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <Inbox className="w-5 h-5" style={{ color: "#A8A9A2" }} />
        </div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>No pending invitations</p>
        <p className="text-xs" style={{ color: "#A8A9A2" }}>
          When someone invites you to manage their server, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-2xl">
      {error && (
        <div
          className="p-3 rounded-xl text-xs font-medium"
          style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {error}
        </div>
      )}

      {invites.map((invite) => {
        const serverName = invite.guildName || invite.guild.name;
        const initial = serverName.charAt(0).toUpperCase();
        const roleStyle = roleStyles[invite.role] || roleStyles.viewer;
        const RoleIcon = roleStyle.icon;
        const rolePreset = ROLE_PRESETS[invite.role as keyof typeof ROLE_PRESETS];
        const isLoading = loading === invite.guildId;

        return (
          <div
            key={invite.id}
            className="flex items-center justify-between gap-4 p-4 rounded-2xl transition-all"
            style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Server icon + info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Server icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden text-sm font-bold"
                style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}
              >
                {invite.guildIcon ? (
                  <img
                    src={invite.guildIcon}
                    alt={serverName}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  initial
                )}
              </div>

              {/* Name + role + inviter */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#F5F4F5" }}>
                  {serverName}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {/* Role badge */}
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{ background: roleStyle.bg, color: roleStyle.color }}
                  >
                    <RoleIcon className="w-3 h-3" />
                    {rolePreset?.name || invite.role}
                  </span>
                  {invite.inviterName && (
                    <span className="text-xs" style={{ color: "#A8A9A2" }}>
                      from {invite.inviterName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleAccept(invite.guildId)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 hover:opacity-90"
                style={{ background: "#1FA7BB", color: "#101012" }}
              >
                <Check className="w-3.5 h-3.5" />
                {isLoading ? "Accepting..." : "Accept"}
              </button>
              <button
                onClick={() => handleDecline(invite.guildId)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50 hover:text-white"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#A8A9A2",
                }}
              >
                <X className="w-3.5 h-3.5" />
                Decline
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
