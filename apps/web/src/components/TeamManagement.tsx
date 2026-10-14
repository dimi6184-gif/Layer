"use client";

import { useState } from "react";
import { Users, UserPlus, Shield, Eye, Trash2, Crown, Settings, ArrowLeft, ChevronDown, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { addTeamMember, removeTeamMember, updateTeamMemberRole } from "@/actions/team";
import { ROLE_PRESETS } from "@/lib/team-permissions";
import { useToast } from "@/context/ToastContext";

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  permissions: { permissions: string[] };
  createdAt: Date;
  avatarUrl?: string | null;
  user: { username: string; discordId: string };
}

interface TeamManagementProps {
  guildId: string;
  teamMembers: TeamMember[];
}

const roleStyles: Record<string, { color: string; bg: string; icon: any }> = {
  owner:         { color: "#EAB308", bg: "rgba(234,179,8,0.12)",   icon: Crown },
  co_owner:      { color: "#EAB308", bg: "rgba(234,179,8,0.12)",   icon: Crown },
  admin:         { color: "#EF4444", bg: "rgba(239,68,68,0.12)",   icon: Shield },
  moderator:     { color: "#1FA7BB", bg: "rgba(31,167,187,0.12)",  icon: Shield },
  event_manager: { color: "#A855F7", bg: "rgba(168,85,247,0.12)",  icon: Users },
  support:       { color: "#22C55E", bg: "rgba(34,197,94,0.12)",   icon: Users },
  viewer:        { color: "#A8A9A2", bg: "rgba(168,169,162,0.12)", icon: Eye },
  custom:        { color: "#F97316", bg: "rgba(249,115,22,0.12)",  icon: Settings },
};

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5", fontSize: 13, outline: "none", fontFamily: "inherit",
};

const labelStyle = {
  color: "#A8A9A2", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase" as const, letterSpacing: "0.05em",
  display: "block", marginBottom: 4,
};

export function TeamManagement({ guildId, teamMembers }: TeamManagementProps) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [discordId, setDiscordId] = useState("");
  const [selectedRole, setSelectedRole] = useState<keyof typeof ROLE_PRESETS>("viewer");
  const [loading, setLoading] = useState(false);
  const [expandedPerms, setExpandedPerms] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTeamMember(guildId, discordId, discordId, selectedRole);
      setIsAddingMember(false);
      setDiscordId("");
      setSelectedRole("viewer");
      showToast("Team member invited");
    } catch (err: any) {
      showToast(err.message || "Failed to add team member", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Remove this team member?")) return;
    setLoading(true);
    try {
      await removeTeamMember(guildId, userId);
      showToast("Team member removed", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to remove member", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: keyof typeof ROLE_PRESETS) => {
    setLoading(true);
    try {
      await updateTeamMemberRole(guildId, userId, newRole);
      showToast("Role updated");
    } catch (err: any) {
      showToast(err.message || "Failed to update role", "error");
    } finally {
      setLoading(false);
    }
  };

  // Roles available for invite/change (exclude system owner)
  const invitableRoles = Object.entries(ROLE_PRESETS).filter(([key]) => key !== "owner");

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${guildId}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Users className="w-5 h-5" style={{ color: "#1FA7BB" }} />
            Team Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Manage who can access and modify your server dashboard</p>
        </div>
        <button
          onClick={() => setIsAddingMember(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Add Member Form */}
      {isAddingMember && (
        <div className="p-5 rounded-2xl mb-2" style={{ background: "#121315", border: "1px solid rgba(31,167,187,0.2)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Invite Team Member</h3>
            <button onClick={() => setIsAddingMember(false)} style={{ color: "#A8A9A2" }}>
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleAddMember} className="space-y-3">
            <div>
              <label style={labelStyle}>Discord User ID</label>
              <input
                type="text"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="123456789012345678"
                style={inputStyle}
                required
              />
              <p className="text-xs mt-1.5" style={{ color: "#A8A9A2" }}>
                Right-click user in Discord → Copy User ID (requires Developer Mode)
              </p>
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as keyof typeof ROLE_PRESETS)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {invitableRoles.map(([key, preset]) => (
                  <option key={key} value={key} style={{ background: "#121315" }}>
                    {preset.name} — {preset.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
                style={{ background: "#1FA7BB", color: "#101012" }}
              >
                {loading ? "Sending invite..." : "Send Invite"}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingMember(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#A8A9A2" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      {teamMembers.length === 0 ? (
        <div className="py-14 text-center rounded-2xl" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Users className="w-8 h-8 mx-auto mb-3" style={{ color: "#A8A9A2" }} />
          <p className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>No team members yet</p>
          <p className="text-xs" style={{ color: "#A8A9A2" }}>Add your first member to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {teamMembers.map((member) => {
            const style = roleStyles[member.role] || roleStyles.viewer;
            const RoleIcon = style.icon;
            const rolePreset = ROLE_PRESETS[member.role as keyof typeof ROLE_PRESETS];
            const isExpanded = expandedPerms.has(member.id);
            const perms = member.permissions.permissions;
            const hasMore = perms.length > 8;

            return (
              <div
                key={member.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Top row */}
                <div className="flex items-center gap-4 p-4">

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.user.username}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          const next = el.nextElementSibling as HTMLElement;
                          if (next) next.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-10 h-10 rounded-xl items-center justify-center text-sm font-bold"
                      style={{
                        display: member.avatarUrl ? "none" : "flex",
                        background: "rgba(31,167,187,0.15)",
                        color: "#1FA7BB",
                      }}
                    >
                      {member.user.username.charAt(0).toUpperCase()}
                    </div>
                    {/* Role indicator dot */}
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                      style={{ background: style.bg, borderColor: "#121315" }}
                    >
                      <RoleIcon className="w-2 h-2" style={{ color: style.color }} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>{member.user.username}</p>
                    <p className="text-xs mt-0.5 font-mono truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {member.user.discordId}
                    </p>
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Role badge */}
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {rolePreset?.name || member.role}
                    </span>

                    {/* Role selector (non-owners) */}
                    {member.role !== "owner" && (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.userId, e.target.value as keyof typeof ROLE_PRESETS)}
                        disabled={loading}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#A8A9A2",
                          cursor: "pointer",
                        }}
                      >
                        {invitableRoles.map(([key, preset]) => (
                          <option key={key} value={key} style={{ background: "#121315" }}>{preset.name}</option>
                        ))}
                      </select>
                    )}

                    {/* Remove (non-owners) */}
                    {member.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        disabled={loading}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center justify-between pt-3 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Permissions
                    </span>
                    {hasMore && (
                      <button
                        onClick={() => {
                          const next = new Set(expandedPerms);
                          isExpanded ? next.delete(member.id) : next.add(member.id);
                          setExpandedPerms(next);
                        }}
                        className="flex items-center gap-1 text-[10px] font-medium transition-colors"
                        style={{ color: "#1FA7BB" }}
                      >
                        {isExpanded ? (
                          <><ChevronUp size={12} /> Show less</>
                        ) : (
                          <><ChevronDown size={12} /> Show all ({perms.length})</>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(isExpanded ? perms : perms.slice(0, 8)).map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          color: "#A8A9A2",
                        }}
                      >
                        {perm.replace(/_/g, " ")}
                      </span>
                    ))}
                    {!isExpanded && hasMore && (
                      <button
                        onClick={() => {
                          const next = new Set(expandedPerms);
                          next.add(member.id);
                          setExpandedPerms(next);
                        }}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                        style={{ background: "rgba(31,167,187,0.08)", color: "#1FA7BB", border: "1px solid rgba(31,167,187,0.15)" }}
                      >
                        +{perms.length - 8} more
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
