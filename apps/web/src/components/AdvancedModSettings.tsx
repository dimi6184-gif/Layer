"use client";

import { useState, useTransition } from "react";
import { Save, Eye, Target, Users, ChevronDown, X } from "lucide-react";
import { ToggleSwitch } from "./Toggle";
import { updateAdvancedModSettings } from "@/actions/advanced-mod";
import { useToast } from "@/context/ToastContext";

interface Channel { id: string; name: string }
interface Role { id: string; name: string }

interface AdvancedModSettingsProps {
  discordId: string;
  settings: {
    avatarTrackingEnabled: boolean;
    avatarHistoryLimit: number;
    avatarLogChannelId: string | null;
    impersonationEnabled: boolean;
    impersonationAutoAction: boolean;
    impersonationActionType: "KICK" | "BAN";
    impersonationSensitivity: "LOW" | "MEDIUM" | "HIGH";
    ghostCleanerEnabled: boolean;
    ghostInactivityDays: number;
    ghostWarningDays: number;
    ghostMaxWarnings: number;
    ghostExemptRoles: string[];
    ghostKickBots: boolean;
  };
  channels: Channel[];
  roles: Role[];
}

const tabs = [
  { id: 'avatar', label: 'Avatar Tracker', icon: Eye },
  { id: 'impersonation', label: 'Impersonation', icon: Target },
  { id: 'ghost', label: 'Ghost Cleaner', icon: Users },
];

const inputSt = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5", fontSize: 13, outline: "none", fontFamily: "inherit",
};
const labelSt = { color: "#A8A9A2", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 4 };
const cardSt = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

// Multi-select dropdown component
function RoleDropdown({ roles, selected, onChange }: {
  roles: Role[]; selected: string[]; onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedNames = roles.filter(r => selected.includes(r.id)).map(r => r.name);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all"
        style={{ ...inputSt, textAlign: "left" as const, cursor: "pointer" }}
      >
        <span style={{ color: selectedNames.length ? "#F5F4F5" : "#A8A9A2" }}>
          {selectedNames.length ? `${selectedNames.length} role${selectedNames.length > 1 ? 's' : ''} selected` : "Select roles..."}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} style={{ color: "#A8A9A2" }} />
      </button>

      {/* Selected tags */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {roles.filter(r => selected.includes(r.id)).map(r => (
            <span
              key={r.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
              style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB", border: "1px solid rgba(31,167,187,0.2)" }}
            >
              @{r.name}
              <button onClick={() => toggle(r.id)} className="hover:opacity-70"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div
          className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto"
          style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {roles.length === 0 ? (
            <div className="px-3 py-3 text-xs" style={{ color: "#A8A9A2" }}>No roles available</div>
          ) : roles.map(r => (
            <label
              key={r.id}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-white/5"
            >
              <input
                type="checkbox"
                checked={selected.includes(r.id)}
                onChange={() => toggle(r.id)}
                style={{ accentColor: "#1FA7BB" }}
              />
              <span className="text-sm" style={{ color: "#F5F4F5" }}>@{r.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdvancedModSettings({ discordId, settings, channels, roles }: AdvancedModSettingsProps) {
  const [activeTab, setActiveTab] = useState('avatar');
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  // Avatar
  const [avatarTrackingEnabled, setAvatarTrackingEnabled] = useState(settings.avatarTrackingEnabled);
  const [avatarHistoryLimit, setAvatarHistoryLimit] = useState(settings.avatarHistoryLimit);
  const [avatarLogChannelId, setAvatarLogChannelId] = useState(settings.avatarLogChannelId || "");

  // Impersonation
  const [impersonationEnabled, setImpersonationEnabled] = useState(settings.impersonationEnabled);
  const [impersonationAutoAction, setImpersonationAutoAction] = useState(settings.impersonationAutoAction);
  const [impersonationActionType, setImpersonationActionType] = useState(settings.impersonationActionType);
  const [impersonationSensitivity, setImpersonationSensitivity] = useState(settings.impersonationSensitivity);

  // Ghost
  const [ghostCleanerEnabled, setGhostCleanerEnabled] = useState(settings.ghostCleanerEnabled);
  const [ghostInactivityDays, setGhostInactivityDays] = useState(settings.ghostInactivityDays);
  const [ghostWarningDays, setGhostWarningDays] = useState(settings.ghostWarningDays);
  const [ghostMaxWarnings, setGhostMaxWarnings] = useState(settings.ghostMaxWarnings);
  const [ghostExemptRoles, setGhostExemptRoles] = useState<string[]>(settings.ghostExemptRoles);
  const [ghostKickBots, setGhostKickBots] = useState(settings.ghostKickBots);

  const handleSave = () => {
    startTransition(async () => {
      await updateAdvancedModSettings(discordId, {
        avatarHistoryLimit, avatarLogChannelId: avatarLogChannelId || null,
        impersonationAutoAction, impersonationActionType, impersonationSensitivity,
        ghostInactivityDays, ghostWarningDays, ghostMaxWarnings,
        ghostExemptRoles, ghostKickBots,
      });
      showToast('Advanced mod settings saved');
    });
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={cardSt}>
      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all"
              style={{ color: isActive ? "#F5F4F5" : "#A8A9A2", borderBottom: isActive ? "2px solid #1FA7BB" : "2px solid transparent", marginBottom: -1 }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? "#1FA7BB" : "#A8A9A2" }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-5">

        {/* ── AVATAR TAB ── */}
        {activeTab === 'avatar' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Profile Picture History Tracker</p>
                <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Track all avatar changes for evidence and investigations.</p>
              </div>
              <ToggleSwitch enabled={avatarTrackingEnabled} onChange={setAvatarTrackingEnabled} />
            </div>

            {avatarTrackingEnabled && (
              <div className="space-y-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <label style={labelSt}>History Limit (per user)</label>
                  <input type="number" min={1} max={50} value={avatarHistoryLimit} onChange={e => setAvatarHistoryLimit(+e.target.value)} style={inputSt} />
                  <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>How many avatars to store per user</p>
                </div>
                <div>
                  <label style={labelSt}>Log Channel (optional)</label>
                  <select value={avatarLogChannelId} onChange={e => setAvatarLogChannelId(e.target.value)} style={{ ...inputSt, cursor: "pointer" }}>
                    <option value="" style={{ background: "#121315" }}>None (don't log)</option>
                    {channels.map(c => <option key={c.id} value={c.id} style={{ background: "#121315" }}>#{c.name}</option>)}
                  </select>
                  <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>Send notifications when users change their avatar</p>
                </div>
                <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)", color: "#1FA7BB" }}>
                  Use <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(31,167,187,0.15)" }}>/avatarhistory @user</code> to view a member's avatar history.
                </div>
              </div>
            )}
          </>
        )}

        {/* ── IMPERSONATION TAB ── */}
        {activeTab === 'impersonation' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Impersonation Detector</p>
                <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Detect and block users trying to impersonate staff members.</p>
              </div>
              <ToggleSwitch enabled={impersonationEnabled} onChange={setImpersonationEnabled} />
            </div>

            {impersonationEnabled && (
              <div className="space-y-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Auto-Action</p>
                    <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Automatically kick/ban HIGH risk impersonators</p>
                  </div>
                  <ToggleSwitch enabled={impersonationAutoAction} onChange={setImpersonationAutoAction} />
                </div>

                {impersonationAutoAction && (
                  <div>
                    <label style={labelSt}>Action Type</label>
                    <select value={impersonationActionType} onChange={e => setImpersonationActionType(e.target.value as "KICK" | "BAN")} style={{ ...inputSt, cursor: "pointer" }}>
                      <option value="KICK" style={{ background: "#121315" }}>Kick (can rejoin)</option>
                      <option value="BAN" style={{ background: "#121315" }}>Ban (permanent)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label style={labelSt}>Detection Sensitivity</label>
                  <select value={impersonationSensitivity} onChange={e => setImpersonationSensitivity(e.target.value as "LOW" | "MEDIUM" | "HIGH")} style={{ ...inputSt, cursor: "pointer" }}>
                    <option value="LOW" style={{ background: "#121315" }}>Low (70%+ similarity = HIGH risk)</option>
                    <option value="MEDIUM" style={{ background: "#121315" }}>Medium (60%+ similarity = HIGH risk)</option>
                    <option value="HIGH" style={{ background: "#121315" }}>High (50%+ similarity = HIGH risk)</option>
                  </select>
                  <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>Higher sensitivity = more detections but more false positives</p>
                </div>

                <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", color: "#F97316" }}>
                  ⚠️ Add staff profiles first using <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.15)" }}>/staffprofile add</code> for detection to work.
                </div>
              </div>
            )}
          </>
        )}

        {/* ── GHOST TAB ── */}
        {activeTab === 'ghost' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Ghost Member Cleaner</p>
                <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Automatically remove inactive members to keep your server active.</p>
              </div>
              <ToggleSwitch enabled={ghostCleanerEnabled} onChange={setGhostCleanerEnabled} />
            </div>

            {ghostCleanerEnabled && (
              <div className="space-y-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelSt}>Inactivity Threshold (days)</label>
                    <input type="number" min={7} max={365} value={ghostInactivityDays} onChange={e => setGhostInactivityDays(+e.target.value)} style={inputSt} />
                  </div>
                  <div>
                    <label style={labelSt}>Days Between Warnings</label>
                    <input type="number" min={1} max={30} value={ghostWarningDays} onChange={e => setGhostWarningDays(+e.target.value)} style={inputSt} />
                  </div>
                </div>

                <div>
                  <label style={labelSt}>Max Warnings Before Kick</label>
                  <input type="number" min={0} max={5} value={ghostMaxWarnings} onChange={e => setGhostMaxWarnings(+e.target.value)} style={inputSt} />
                  <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>0 = kick immediately without warning</p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Kick Bots</p>
                    <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Also remove inactive bot accounts</p>
                  </div>
                  <ToggleSwitch enabled={ghostKickBots} onChange={setGhostKickBots} />
                </div>

                <div>
                  <label style={labelSt}>Exempt Roles</label>
                  <p className="text-xs mb-2" style={{ color: "#A8A9A2" }}>Members with these roles will never be kicked</p>
                  <RoleDropdown roles={roles} selected={ghostExemptRoles} onChange={setGhostExemptRoles} />
                </div>

                <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)", color: "#1FA7BB" }}>
                  Runs daily at 3:00 AM. Use <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(31,167,187,0.15)" }}>/ghostclean scan</code> to preview changes.
                </div>
              </div>
            )}
          </>
        )}

        {/* Save */}
        <div className="flex justify-end pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
            style={{ background: "#1FA7BB", color: "#101012" }}
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
