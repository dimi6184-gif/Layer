"use client";

import { useState } from "react";
import { Users, UserPlus, Shield, Eye, Trash2, Crown, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { addTeamMember, removeTeamMember, updateTeamMemberRole } from "@/actions/team";
import { ROLE_PRESETS } from "@/lib/team-permissions";

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  permissions: { permissions: string[] };
  createdAt: Date;
  user: { username: string; discordId: string };
}

interface TeamManagementProps {
  guildId: string;
  teamMembers: TeamMember[];
}

const roleColors: Record<string, { bg: string; color: string }> = {
  owner:         { bg: "rgba(234,179,8,0.12)",   color: "#EAB308" },
  admin:         { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
  moderator:     { bg: "rgba(31,167,187,0.12)",  color: "#1FA7BB" },
  event_manager: { bg: "rgba(168,85,247,0.12)",  color: "#A855F7" },
  support:       { bg: "rgba(34,197,94,0.12)",   color: "#22C55E" },
  viewer:        { bg: "rgba(168,169,162,0.12)", color: "#A8A9A2" },
  custom:        { bg: "rgba(249,115,22,0.12)",  color: "#F97316" },
};

const roleIcons: Record<string, any> = {
  owner: Crown, admin: Shield, moderator: Shield,
  event_manager: Users, support: Users, viewer: Eye, custom: Settings,
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5",
  fontSize: 14,
  outline: "none",
};

export function TeamManagement({ guildId, teamMembers }: TeamManagementProps) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [discordId, setDiscordId] = useState("");
  const [selectedRole, setSelectedRole] = useState<keyof typeof ROLE_PRESETS>("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set());

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addTeamMember(guildId, discordId, discordId, selectedRole);
      setIsAddingMember(false);
      setDiscordId("");
      setSelectedRole("viewer");
    } catch (err: any) {
      setError(err.message || "Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Remove this team member?")) return;
    setLoading(true);
    try {
      await removeTeamMember(guildId, userId);
    } catch (err: any) {
      setError(err.message || "Failed to remove team member");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: keyof typeof ROLE_PRESETS) => {
    setLoading(true);
    try {
      await updateTeamMemberRole(guildId, userId, newRole);
    } catch (err: any) {
      setError(err.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">

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

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}

      {/* Add Member Form */}
      {isAddingMember && (
        <div className="p-5 rounded-2xl" style={{ background: "#121315", border: "1px solid rgba(31,167,187,0.2)" }}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: "#F5F4F5" }}>
            <UserPlus className="w-4 h-4" style={{ color: "#1FA7BB" }} />
            Add Team Member
          </h3>
          <form onSubmit={handleAddMember} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#A8A9A2" }}>Discord User ID</label>
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
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#A8A9A2" }}>Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as keyof typeof ROLE_PRESETS)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {Object.entries(ROLE_PRESETS).map(([key, preset]) => (
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
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: "#1FA7BB", color: "#101012" }}
              >
                {loading ? "Adding..." : "Add Member"}
              </button>
              <button
                type="button"
                onClick={() => { setIsAddingMember(false); setError(""); }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.06)", color: "#A8A9A2" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {teamMembers.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Users className="w-8 h-8 mx-auto mb-3" style={{ color: "#A8A9A2" }} />
            <p className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>No team members yet</p>
            <p className="text-xs" style={{ color: "#A8A9A2" }}>Add your first member to get started.</p>
          </div>
        ) : (
          teamMembers.map((member) => {
            const RoleIcon = roleIcons[member.role] || Users;
            const roleColor = roleColors[member.role] || roleColors.viewer;
            const rolePreset = ROLE_PRESETS[member.role as keyof typeof ROLE_PRESETS];
            const discordAvatarUrl = `https://cdn.discordapp.com/avatars/${member.user.discordId}/avatar.png?size=128`;
            const isExpanded = expandedPermissions.has(member.id);
            const hasMore = member.permissions.permissions.length > 8;

            return (
              <div
                key={member.id}
                className="p-5 rounded-2xl"
                style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Top row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={discordAvatarUrl}
                        alt={member.user.username}
                        className="w-10 h-10 rounded-xl object-cover"
                        style={{ background: "rgba(31,167,187,0.15)" }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                        }}
                      />
                      <div
                        className="w-10 h-10 rounded-xl items-center justify-center text-sm font-bold"
                        style={{ display: 'none', background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}
                      >
                        {member.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 p-1 rounded-md"
                        style={{ background: "#101012" }}
                      >
                        <RoleIcon className="w-2.5 h-2.5" style={{ color: roleColor.color }} />
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>{member.user.username}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>ID: {member.user.discordId}</p>
                    </div>
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-2">
                    {/* Role badge */}
                    <span
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: roleColor.bg, color: roleColor.color }}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {rolePreset?.name || member.role}
                    </span>

                    {/* Role selector */}
                    {member.role !== "owner" && (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.userId, e.target.value as keyof typeof ROLE_PRESETS)}
                        disabled={loading}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#A8A9A2",
                          cursor: "pointer",
                        }}
                      >
                        {Object.entries(ROLE_PRESETS).filter(([k]) => k !== "owner").map(([key, preset]) => (
                          <option key={key} value={key} style={{ background: "#121315" }}>{preset.name}</option>
                        ))}
                      </select>
                    )}

                    {/* Remove */}
                    {member.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        disabled={loading}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Permissions</p>
                    {hasMore && (
                      <button
                        onClick={() => {
                          const next = new Set(expandedPermissions);
                          isExpanded ? next.delete(member.id) : next.add(member.id);
                          setExpandedPermissions(next);
                        }}
                        className="text-xs font-semibold"
                        style={{ color: "#1FA7BB" }}
                      >
                        {isExpanded ? "Show less" : `Show all (${member.permissions.permissions.length})`}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(isExpanded ? member.permissions.permissions : member.permissions.permissions.slice(0, 8)).map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-1 rounded-md text-[10px] font-medium"
                        style={{ background: "rgba(255,255,255,0.04)", color: "#A8A9A2", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {perm.replace(/_/g, " ")}
                      </span>
                    ))}
                    {!isExpanded && hasMore && (
                      <button
                        onClick={() => {
                          const next = new Set(expandedPermissions);
                          next.add(member.id);
                          setExpandedPermissions(next);
                        }}
                        className="px-2 py-1 rounded-md text-[10px] font-semibold"
                        style={{ background: "rgba(31,167,187,0.08)", color: "#1FA7BB", border: "1px solid rgba(31,167,187,0.15)" }}
                      >
                        +{member.permissions.permissions.length - 8} more
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
