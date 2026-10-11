'use client';

import { useState } from 'react';
import { UserPlus, UserMinus, Save, Image as ImageIcon, Mail, Check, Loader2, Eye } from 'lucide-react';
import { updateWelcomeSettings, updateLeaveSettings } from '@/actions/welcome';
import { WelcomeImageEditorModal, ImageConfig } from './WelcomeImageEditorModal';
import { useToast } from '@/context/ToastContext';
import { ToggleSwitch } from './Toggle';

interface Channel { id: string; name: string; type: number }
interface Role { id: string; name: string; color: number }

interface WelcomeSettingsProps {
  guildId: string;
  settings: {
    welcomeEnabled: boolean; welcomeChannelId: string; welcomeMessage: string;
    welcomeEmbedEnabled: boolean; welcomeEmbedTitle: string; welcomeEmbedDescription: string;
    welcomeEmbedColor: string; welcomeImageEnabled: boolean; welcomeImageConfig: any;
    welcomeDMEnabled: boolean; welcomeDMMessage: string; autoRoleIds: string[];
    leaveEnabled: boolean; leaveChannelId: string; leaveMessage: string;
    leaveEmbedEnabled: boolean; leaveEmbedTitle: string; leaveEmbedDescription: string;
    leaveEmbedColor: string;
  };
  channels: Channel[];
  roles: Role[];
}

const tabs = [
  { id: 'welcome', label: 'Welcome', icon: UserPlus },
  { id: 'leave', label: 'Leave', icon: UserMinus },
];

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5", fontSize: 13, outline: "none", fontFamily: "inherit",
};
const labelStyle = { color: "#A8A9A2", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" };

function replace(text: string, isLeave = false) {
  return text
    .replace(/{user}/g, isLeave ? 'OldUser' : '@NewUser')
    .replace(/{username}/g, isLeave ? 'OldUser' : 'NewUser')
    .replace(/{server}/g, 'Server Name')
    .replace(/{memberCount}/g, isLeave ? '1,233' : '1,234');
}

export function WelcomeSettings({ guildId, settings: s, channels, roles }: WelcomeSettingsProps) {
  const [activeTab, setActiveTab] = useState('welcome');

  // Welcome
  const [welcomeEnabled, setWelcomeEnabled] = useState(s.welcomeEnabled);
  const [welcomeChannelId, setWelcomeChannelId] = useState(s.welcomeChannelId);
  const [welcomeMessage, setWelcomeMessage] = useState(s.welcomeMessage);
  const [welcomeEmbedEnabled, setWelcomeEmbedEnabled] = useState(s.welcomeEmbedEnabled);
  const [welcomeEmbedTitle, setWelcomeEmbedTitle] = useState(s.welcomeEmbedTitle);
  const [welcomeEmbedDescription, setWelcomeEmbedDescription] = useState(s.welcomeEmbedDescription);
  const [welcomeEmbedColor, setWelcomeEmbedColor] = useState(s.welcomeEmbedColor);
  const [welcomeImageEnabled, setWelcomeImageEnabled] = useState(s.welcomeImageEnabled);
  const [welcomeImageConfig, setWelcomeImageConfig] = useState<ImageConfig | null>(s.welcomeImageConfig);
  const [welcomeDMEnabled, setWelcomeDMEnabled] = useState(s.welcomeDMEnabled);
  const [welcomeDMMessage, setWelcomeDMMessage] = useState(s.welcomeDMMessage);
  const [autoRoleIds, setAutoRoleIds] = useState<string[]>(s.autoRoleIds);
  const [showImageEditor, setShowImageEditor] = useState(false);

  // Leave
  const [leaveEnabled, setLeaveEnabled] = useState(s.leaveEnabled);
  const [leaveChannelId, setLeaveChannelId] = useState(s.leaveChannelId);
  const [leaveMessage, setLeaveMessage] = useState(s.leaveMessage);
  const [leaveEmbedEnabled, setLeaveEmbedEnabled] = useState(s.leaveEmbedEnabled);
  const [leaveEmbedTitle, setLeaveEmbedTitle] = useState(s.leaveEmbedTitle);
  const [leaveEmbedDescription, setLeaveEmbedDescription] = useState(s.leaveEmbedDescription);
  const [leaveEmbedColor, setLeaveEmbedColor] = useState(s.leaveEmbedColor);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const showSaved = (msg = 'Settings saved') => { setSaved(true); showToast(msg); setTimeout(() => setSaved(false), 3000); };
  const showErr = (msg: string) => { setError(msg); setTimeout(() => setError(''), 4000); };

  const handleSaveWelcome = async () => {
    setLoading(true);
    try {
      await updateWelcomeSettings(guildId, {
        welcomeEnabled, welcomeChannelId: welcomeChannelId || undefined,
        welcomeMessage: welcomeMessage || undefined, welcomeEmbedEnabled,
        welcomeEmbedTitle, welcomeEmbedDescription, welcomeEmbedColor,
        welcomeImageEnabled, welcomeImageConfig, welcomeDMEnabled,
        welcomeDMMessage: welcomeDMMessage || undefined, autoRoleIds,
      });
      showSaved('Welcome settings saved');
    } catch (err: any) { showErr(err.message || 'Failed to save'); }
    finally { setLoading(false); }
  };

  const handleSaveLeave = async () => {
    setLoading(true);
    try {
      await updateLeaveSettings(guildId, {
        leaveEnabled, leaveChannelId: leaveChannelId || undefined,
        leaveMessage: leaveMessage || undefined, leaveEmbedEnabled,
        leaveEmbedTitle, leaveEmbedDescription, leaveEmbedColor,
      });
      showSaved('Leave settings saved');
    } catch (err: any) { showErr(err.message || 'Failed to save'); }
    finally { setLoading(false); }
  };

  const toggleAutoRole = (id: string) =>
    setAutoRoleIds(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);

  const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="space-y-3">
      {/* Placeholders info */}
      <div className="flex flex-wrap gap-2 p-4 rounded-2xl" style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}>
        <span className="text-xs font-semibold mr-2" style={{ color: "#1FA7BB" }}>Placeholders:</span>
        {['{user}', '{username}', '{server}', '{memberCount}'].map(p => (
          <code key={p} className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: "rgba(31,167,187,0.12)", color: "#1FA7BB" }}>{p}</code>
        ))}
      </div>

      {error && <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>}

      {/* Tabbed card */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Tab bar */}
        <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all"
                style={{ color: isActive ? "#F5F4F5" : "#A8A9A2", borderBottom: isActive ? "2px solid #1FA7BB" : "2px solid transparent", marginBottom: -1 }}>
                <Icon className="w-4 h-4" style={{ color: isActive ? "#1FA7BB" : "#A8A9A2" }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-5">

          {/* -- WELCOME TAB -- */}
          {activeTab === 'welcome' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Welcome Messages</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Send a message when new members join</p>
                </div>
                <ToggleSwitch enabled={welcomeEnabled} onChange={setWelcomeEnabled} />
              </div>

              <div>
                <label className="block mb-1.5" style={labelStyle}>Welcome Channel</label>
                <select value={welcomeChannelId} onChange={(e) => setWelcomeChannelId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#121315" }}>Select a channel...</option>
                  {channels.map((c) => <option key={c.id} value={c.id} style={{ background: "#121315" }}># {c.name}</option>)}
                </select>
              </div>

              {/* Embed toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Use Embed</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Rich embed with custom title and color</p>
                </div>
                <ToggleSwitch enabled={welcomeEmbedEnabled} onChange={setWelcomeEmbedEnabled} />
              </div>

              {welcomeEmbedEnabled ? (
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Embed Title</label>
                    <input type="text" value={welcomeEmbedTitle} onChange={(e) => setWelcomeEmbedTitle(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Embed Description</label>
                    <textarea value={welcomeEmbedDescription} onChange={(e) => setWelcomeEmbedDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Embed Color</label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <input type="color" value={welcomeEmbedColor} onChange={(e) => setWelcomeEmbedColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                      <span className="text-xs font-mono" style={{ color: "#A8A9A2" }}>{welcomeEmbedColor}</span>
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="rounded-xl border-l-4 p-4" style={{ borderColor: welcomeEmbedColor, background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-sm font-bold mb-1" style={{ color: "#F5F4F5" }}>{replace(welcomeEmbedTitle) || "Title"}</p>
                    <p className="text-xs whitespace-pre-wrap" style={{ color: "#A8A9A2" }}>{replace(welcomeEmbedDescription) || "Description..."}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block mb-1.5" style={labelStyle}>Welcome Message</label>
                  <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={3} placeholder="Enter your welcome message..." style={{ ...inputStyle, resize: "vertical" }} />
                  {welcomeMessage && (
                    <div className="mt-2 p-3 rounded-xl text-xs whitespace-pre-wrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#A8A9A2" }}>
                      {replace(welcomeMessage)}
                    </div>
                  )}
                </div>
              )}

              {/* Image */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "#F5F4F5" }}><ImageIcon className="w-3.5 h-3.5" /> Welcome Image</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Auto-generate an image with user avatar</p>
                </div>
                <ToggleSwitch enabled={welcomeImageEnabled} onChange={setWelcomeImageEnabled} />
              </div>

              {welcomeImageEnabled && (
                <button type="button" onClick={() => setShowImageEditor(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F4F5" }}>
                  <ImageIcon className="w-4 h-4" style={{ color: "#1FA7BB" }} /> Customize Welcome Image
                </button>
              )}

              {showImageEditor && (
                <WelcomeImageEditorModal
                  initialConfig={welcomeImageConfig || undefined}
                  onSave={(config) => { setWelcomeImageConfig(config); setShowImageEditor(false); }}
                  onClose={() => setShowImageEditor(false)}
                />
              )}

              {/* DM */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "#F5F4F5" }}><Mail className="w-3.5 h-3.5" /> Send Welcome DM</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Send a private message to new members</p>
                </div>
                <ToggleSwitch enabled={welcomeDMEnabled} onChange={setWelcomeDMEnabled} />
              </div>
              {welcomeDMEnabled && (
                <div>
                  <label className="block mb-1.5" style={labelStyle}>DM Message</label>
                  <textarea value={welcomeDMMessage} onChange={(e) => setWelcomeDMMessage(e.target.value)} rows={2} placeholder="Private DM message..." style={{ ...inputStyle, resize: "vertical" }} />
                </div>
              )}

              {/* Auto Roles */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>Auto-Assign Roles</label>
                <p className="text-xs mb-2" style={{ color: "#A8A9A2" }}>Roles automatically assigned to new members</p>
                <div className="rounded-xl p-2 max-h-40 overflow-y-auto space-y-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {roles.length === 0 ? (
                    <p className="text-xs p-2" style={{ color: "#A8A9A2" }}>No roles available</p>
                  ) : roles.map((role) => (
                    <label key={role.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5">
                      <input type="checkbox" checked={autoRoleIds.includes(role.id)} onChange={() => toggleAutoRole(role.id)} className="rounded" style={{ accentColor: "#1FA7BB" }} />
                      <span className="text-sm font-medium" style={{ color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#F5F4F5' }}>{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSaveWelcome} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {loading ? "Saving..." : saved ? "Saved!" : "Save Welcome"}
                </button>
                {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>? Saved</span>}
              </div>
            </div>
          )}

          {/* -- LEAVE TAB -- */}
          {activeTab === 'leave' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Leave Messages</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Send a message when members leave</p>
                </div>
                <ToggleSwitch enabled={leaveEnabled} onChange={setLeaveEnabled} />
              </div>

              <div>
                <label className="block mb-1.5" style={labelStyle}>Leave Channel</label>
                <select value={leaveChannelId} onChange={(e) => setLeaveChannelId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#121315" }}>Select a channel...</option>
                  {channels.map((c) => <option key={c.id} value={c.id} style={{ background: "#121315" }}># {c.name}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Use Embed</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Rich embed with custom title and color</p>
                </div>
                <ToggleSwitch enabled={leaveEmbedEnabled} onChange={setLeaveEmbedEnabled} />
              </div>

              {leaveEmbedEnabled ? (
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Embed Title</label>
                    <input type="text" value={leaveEmbedTitle} onChange={(e) => setLeaveEmbedTitle(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Embed Description</label>
                    <textarea value={leaveEmbedDescription} onChange={(e) => setLeaveEmbedDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Embed Color</label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <input type="color" value={leaveEmbedColor} onChange={(e) => setLeaveEmbedColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                      <span className="text-xs font-mono" style={{ color: "#A8A9A2" }}>{leaveEmbedColor}</span>
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="rounded-xl border-l-4 p-4" style={{ borderColor: leaveEmbedColor, background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-sm font-bold mb-1" style={{ color: "#F5F4F5" }}>{replace(leaveEmbedTitle, true) || "Title"}</p>
                    <p className="text-xs whitespace-pre-wrap" style={{ color: "#A8A9A2" }}>{replace(leaveEmbedDescription, true) || "Description..."}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block mb-1.5" style={labelStyle}>Leave Message</label>
                  <textarea value={leaveMessage} onChange={(e) => setLeaveMessage(e.target.value)} rows={3} placeholder="Enter your leave message..." style={{ ...inputStyle, resize: "vertical" }} />
                  {leaveMessage && (
                    <div className="mt-2 p-3 rounded-xl text-xs whitespace-pre-wrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#A8A9A2" }}>
                      {replace(leaveMessage, true)}
                    </div>
                  )}
                </div>
              )}

              {/* Save */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSaveLeave} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {loading ? "Saving..." : saved ? "Saved!" : "Save Leave"}
                </button>
                {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>? Saved</span>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
