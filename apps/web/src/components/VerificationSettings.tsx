'use client';

import { useState } from 'react';
import { Shield, Save, Send, Lock, Check, Loader2, ShieldCheck, Eye, Info, AlertTriangle } from 'lucide-react';
import { updateVerificationSettings, sendVerificationPanel, autoLockServer } from '@/actions/verification';
import { EmojiPicker } from './EmojiPicker';
import { useToast } from '@/context/ToastContext';
import { ToggleSwitch } from './Toggle';

interface Channel { id: string; name: string; type: number }
interface Role { id: string; name: string; color: number }

interface VerificationSettingsProps {
  guildId: string;
  settings: {
    enabled: boolean; roleId: string; panelTitle: string;
    panelDescription: string; panelColor: string;
    buttonLabel: string; buttonEmoji: string;
    captchaEnabled: boolean; logChannelId: string;
  };
  channels: Channel[];
  roles: Role[];
}

const tabs = [
  { id: 'settings', label: 'Settings', icon: Shield },
  { id: 'panel', label: 'Panel', icon: Eye },
  { id: 'deploy', label: 'Deploy', icon: Send },
];

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5", fontSize: 13, outline: "none", fontFamily: "inherit",
};

const labelStyle = {
  color: "#A8A9A2", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase" as const, letterSpacing: "0.05em",
};

export function VerificationSettings({ guildId, settings: initialSettings, channels, roles }: VerificationSettingsProps) {
  const [activeTab, setActiveTab] = useState('settings');
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [roleId, setRoleId] = useState(initialSettings.roleId);
  const [panelTitle, setPanelTitle] = useState(initialSettings.panelTitle);
  const [panelDescription, setPanelDescription] = useState(initialSettings.panelDescription);
  const [panelColor, setPanelColor] = useState(initialSettings.panelColor);
  const [buttonLabel, setButtonLabel] = useState(initialSettings.buttonLabel);
  const [buttonEmoji, setButtonEmoji] = useState(initialSettings.buttonEmoji);
  const [captchaEnabled, setCaptchaEnabled] = useState(initialSettings.captchaEnabled);
  const [logChannelId, setLogChannelId] = useState(initialSettings.logChannelId);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();
  const [sendLoading, setSendLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);
  const [sendChannelId, setSendChannelId] = useState('');
  const [lockChannelId, setLockChannelId] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const showMsg = (text: string, isError = false) => {
    if (isError) setError(text); else setMsg(text);
    setTimeout(() => { setError(''); setMsg(''); }, 4000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateVerificationSettings(guildId, { enabled, roleId, panelTitle, panelDescription, panelColor, buttonLabel, buttonEmoji, captchaEnabled, logChannelId });
      if (res && !res.success) {
        showMsg(res.error || 'Failed to save settings', true);
        return;
      }
      setSaved(true);
      showToast('Verification settings saved');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      showMsg(err.message || 'Failed to save settings', true);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPanel = async () => {
    if (!sendChannelId) return showMsg('Select a channel first', true);
    if (!enabled) {
      showMsg('Please enable Verification in the Settings tab first and click Save!', true);
      setActiveTab('settings');
      return;
    }
    if (!roleId) {
      showMsg('Please select a Verified Role in the Settings tab first and click Save!', true);
      setActiveTab('settings');
      return;
    }
    setSendLoading(true);
    try {
      const res = await sendVerificationPanel(guildId, sendChannelId);
      if (res && !res.success) {
        showMsg(res.error || 'Failed to send panel', true);
        return;
      }
      showMsg('✅ Panel sent! Check the channel in Discord.');
      setSendChannelId('');
    } catch (err: any) {
      showMsg(err.message || 'Failed to send panel', true);
    } finally {
      setSendLoading(false);
    }
  };

  const handleAutoLock = async () => {
    if (!lockChannelId) return showMsg('Select the verification channel first', true);
    if (!enabled) {
      showMsg('Please enable Verification in the Settings tab first and click Save!', true);
      setActiveTab('settings');
      return;
    }
    if (!roleId) {
      showMsg('Please select a Verified Role in the Settings tab first and click Save!', true);
      setActiveTab('settings');
      return;
    }
    if (!confirm('This will lock ALL channels for unverified users. Continue?')) return;
    setLockLoading(true);
    try {
      const res = await autoLockServer(guildId, lockChannelId);
      if (res && !res.success) {
        showMsg(res.error || 'Failed to lock server', true);
        return;
      }
      showMsg(`🔒 ${res.message || 'Server locked successfully!'}`);
    } catch (err: any) {
      showMsg(err.message || 'Failed to lock server', true);
    } finally {
      setLockLoading(false);
    }
  };

  const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="space-y-3">

      {/* Privacy Banner */}
      <div className="flex gap-3 p-4 rounded-2xl" style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}>
        <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1FA7BB" }} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold" style={{ color: "#1FA7BB" }}>Privacy-First Verification</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}>ZERO IP LOGGING</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#A8A9A2" }}>
            Verification happens entirely within Discord. No external website, no IP collection, no emails stored.
          </p>
        </div>
      </div>

      {/* Status messages */}
      {error && <div className="p-3 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>}
      {msg && <div className="p-3 rounded-xl text-xs font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.2)" }}>{msg}</div>}

      {/* Tabbed card */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Tab bar */}
        <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all"
                style={{
                  color: isActive ? "#F5F4F5" : "#A8A9A2",
                  borderBottom: isActive ? "2px solid #1FA7BB" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? "#1FA7BB" : "#A8A9A2" }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-5">

          {/* -- SETTINGS TAB -- */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* Enable */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Verification</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Require users to verify before accessing the server</p>
                </div>
                <ToggleSwitch enabled={enabled} onChange={setEnabled} />
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                <label className="block mb-1.5" style={labelStyle}>Verified Role *</label>
                <select value={roleId} onChange={(e) => setRoleId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#121315" }}>Select a role...</option>
                  {roles.map((role) => <option key={role.id} value={role.id} style={{ background: "#121315" }}>{role.name}</option>)}
                </select>
                <p className="text-xs mt-1.5" style={{ color: "#A8A9A2" }}>Role to give users after verification</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable CAPTCHA</p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Show a 6-digit code users must enter</p>
                </div>
                <ToggleSwitch enabled={captchaEnabled} onChange={setCaptchaEnabled} />
              </div>

              <div>
                <label className="block mb-1.5" style={labelStyle}>Log Channel (Optional)</label>
                <select value={logChannelId} onChange={(e) => setLogChannelId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#121315" }}>None</option>
                  {channels.map((c) => <option key={c.id} value={c.id} style={{ background: "#121315" }}># {c.name}</option>)}
                </select>
                <p className="text-xs mt-1.5" style={{ color: "#A8A9A2" }}>Channel to log successful verifications</p>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {loading ? "Saving..." : saved ? "Saved!" : "Save Settings"}
                </button>
                {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>? Settings saved</span>}
              </div>
            </div>
          )}

          {/* -- PANEL TAB -- */}
          {activeTab === 'panel' && (
            <div className="space-y-5">
              {/* Live preview */}
              <div className="rounded-xl border-l-4 p-4" style={{ borderColor: panelColor, background: "rgba(255,255,255,0.03)" }}>
                <p className="text-sm font-bold mb-1" style={{ color: "#F5F4F5" }}>{panelTitle || "Panel Title"}</p>
                <p className="text-xs leading-relaxed mb-3 whitespace-pre-wrap" style={{ color: "#A8A9A2" }}>{panelDescription || "Description..."}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: panelColor }}>
                  {buttonEmoji} {buttonLabel || "Button"}
                </span>
              </div>

              <div>
                <label className="block mb-1.5" style={labelStyle}>Panel Title</label>
                <input type="text" value={panelTitle} onChange={(e) => setPanelTitle(e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label className="block mb-1.5" style={labelStyle}>Panel Description</label>
                <textarea value={panelDescription} onChange={(e) => setPanelDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5" style={labelStyle}>Button Label</label>
                  <input type="text" value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} style={inputStyle} />
                </div>
                <div className="relative">
                  <label className="block mb-1.5" style={labelStyle}>Button Emoji</label>
                  <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-12 h-10 rounded-xl text-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {buttonEmoji || '?'}
                  </button>
                  {showEmojiPicker && <EmojiPicker onSelect={(e) => { setButtonEmoji(e); setShowEmojiPicker(false); }} onClose={() => setShowEmojiPicker(false)} />}
                </div>
              </div>

              <div>
                <label className="block mb-2" style={labelStyle}>Panel Color</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <input type="color" value={panelColor} onChange={(e) => setPanelColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                  <span className="text-xs font-mono" style={{ color: "#A8A9A2" }}>{panelColor}</span>
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {loading ? "Saving..." : saved ? "Saved!" : "Save Panel"}
                </button>
              </div>
            </div>
          )}

          {/* -- DEPLOY TAB -- */}
          {activeTab === 'deploy' && (
            <div className="space-y-5">

              {/* Notice if settings not complete */}
              {(!enabled || !roleId) && (
                <div className="p-3.5 rounded-xl flex items-center justify-between" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#EF4444" }} />
                    <span className="text-xs" style={{ color: "#FCA5A5" }}>
                      {!enabled
                        ? "Verification is currently disabled. Enable it in the Settings tab."
                        : "No Verified Role selected yet. Select a role in the Settings tab."}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-90"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                  >
                    Go to Settings →
                  </button>
                </div>
              )}

              {/* Send Panel */}
              <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Send className="w-4 h-4" style={{ color: "#1FA7BB" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Send Verification Panel</h3>
                </div>
                <p className="text-xs" style={{ color: "#A8A9A2" }}>Post the verification panel to a channel in Discord.</p>
                <select value={sendChannelId} onChange={(e) => setSendChannelId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#121315" }}>Choose a channel...</option>
                  {channels.map((c) => <option key={c.id} value={c.id} style={{ background: "#121315" }}># {c.name}</option>)}
                </select>
                <button onClick={handleSendPanel} disabled={sendLoading || !sendChannelId} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
                  {sendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sendLoading ? "Sending..." : "Send Panel"}
                </button>
              </div>

              {/* Auto-Lock */}
              <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4" style={{ color: "#F97316" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Auto-Lock Server</h3>
                </div>
                <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "#F97316" }}>
                  ⚠️ Locks ALL channels for @everyone. Only the verification channel stays visible to new members.
                </div>
                <select value={lockChannelId} onChange={(e) => setLockChannelId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#121315" }}>Choose the verification channel...</option>
                  {channels.map((c) => <option key={c.id} value={c.id} style={{ background: "#121315" }}># {c.name}</option>)}
                </select>
                <button onClick={handleAutoLock} disabled={lockLoading || !lockChannelId} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:opacity-90" style={{ background: "#F97316", color: "#ffffff" }}>
                  {lockLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {lockLoading ? "Locking..." : "Auto-Lock Server"}
                </button>
              </div>

              {/* Quick Setup */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "#1FA7BB" }}>Quick Setup</p>
                <ol className="text-xs space-y-1 list-decimal list-inside" style={{ color: "#A8A9A2" }}>
                  <li>Configure settings in the Settings tab</li>
                  <li>Customize the panel in the Panel tab</li>
                  <li>(Optional) Use Auto-Lock to protect all channels</li>
                  <li>Send the panel to a channel</li>
                  <li>Users can now verify by clicking the button!</li>
                </ol>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
