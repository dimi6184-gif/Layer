"use client";

import { useState, useTransition } from "react";
import { updateModerationSettings } from "@/actions/modules";
import { updateAutoModSettings } from "@/actions/auto-mod";
import { useToast } from "@/context/ToastContext";
import { Save, ShieldAlert, TextQuote, X, Plus, Trash2, Check } from "lucide-react";
import { ToggleSwitch } from "./Toggle";

interface Channel { id: string; name: string }
interface Role { id: string; name: string }

const ACTION_OPTIONS = [
  { value: 'delete', label: 'Delete Message' },
  { value: 'warn', label: 'Warn' },
  { value: 'timeout', label: 'Timeout' },
  { value: 'kick', label: 'Kick' },
  { value: 'ban', label: 'Ban' },
];

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5",
  fontSize: 13,
  outline: "none",
};

const selectStyle = { ...inputStyle, cursor: "pointer" };

function RuleCard({ title, description, enabled, onToggle, icon, children }: {
  title: string; description: string; enabled: boolean;
  onToggle: () => void; icon: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        style={{ background: enabled ? "rgba(31,167,187,0.06)" : "rgba(255,255,255,0.02)" }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>{title}</h4>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>{description}</p>
          </div>
        </div>
        <ToggleSwitch enabled={enabled} onChange={onToggle} />
      </div>
      {enabled && (
        <div className="p-4 space-y-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ActionSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Action</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {ACTION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: "#121315" }}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, hint }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#A8A9A2" }}>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} style={inputStyle} />
      {hint && <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>{hint}</p>}
    </div>
  );
}

export function ModerationSettings({ discordId, initialBannedWords, initialAntiSpam, autoModSettings, channels, roles }: {
  discordId: string; initialBannedWords: string[]; initialAntiSpam: boolean;
  autoModSettings: any; channels: Channel[]; roles: Role[];
}) {
  const [bannedWords, setBannedWords] = useState<string[]>(initialBannedWords || []);
  const [newWord, setNewWord] = useState("");
  const [antiSpam, setAntiSpam] = useState(initialAntiSpam);
  const [autoModEnabled, setAutoModEnabled] = useState(autoModSettings.autoModEnabled);
  const [spamEnabled, setSpamEnabled] = useState(autoModSettings.autoModSpamEnabled);
  const [spamMaxMessages, setSpamMaxMessages] = useState(autoModSettings.autoModSpamMaxMessages);
  const [spamTimeframe, setSpamTimeframe] = useState(autoModSettings.autoModSpamTimeframe);
  const [spamAction, setSpamAction] = useState(autoModSettings.autoModSpamAction);
  const [spamTimeoutDuration, setSpamTimeoutDuration] = useState(autoModSettings.autoModSpamTimeoutDuration);
  const [capsEnabled, setCapsEnabled] = useState(autoModSettings.autoModCapsEnabled);
  const [capsThreshold, setCapsThreshold] = useState(autoModSettings.autoModCapsThreshold);
  const [capsMinLength, setCapsMinLength] = useState(autoModSettings.autoModCapsMinLength);
  const [capsAction, setCapsAction] = useState(autoModSettings.autoModCapsAction);
  const [linksEnabled, setLinksEnabled] = useState(autoModSettings.autoModLinksEnabled);
  const [linksWhitelist, setLinksWhitelist] = useState<string[]>(autoModSettings.autoModLinksWhitelist);
  const [linksAction, setLinksAction] = useState(autoModSettings.autoModLinksAction);
  const [newDomain, setNewDomain] = useState('');
  const [invitesEnabled, setInvitesEnabled] = useState(autoModSettings.autoModInvitesEnabled);
  const [invitesAction, setInvitesAction] = useState(autoModSettings.autoModInvitesAction);
  const [mentionsEnabled, setMentionsEnabled] = useState(autoModSettings.autoModMentionsEnabled);
  const [mentionsMax, setMentionsMax] = useState(autoModSettings.autoModMentionsMax);
  const [mentionsAction, setMentionsAction] = useState(autoModSettings.autoModMentionsAction);
  const [emojisEnabled, setEmojisEnabled] = useState(autoModSettings.autoModEmojisEnabled);
  const [emojisMax, setEmojisMax] = useState(autoModSettings.autoModEmojisMax);
  const [emojisAction, setEmojisAction] = useState(autoModSettings.autoModEmojisAction);
  const [attachmentsEnabled, setAttachmentsEnabled] = useState(autoModSettings.autoModAttachmentsEnabled);
  const [attachmentsAction, setAttachmentsAction] = useState(autoModSettings.autoModAttachmentsAction);
  const [whitelistChannels, setWhitelistChannels] = useState<string[]>(autoModSettings.autoModWhitelistChannels);
  const [whitelistRoles, setWhitelistRoles] = useState<string[]>(autoModSettings.autoModWhitelistRoles);
  const [duplicatesEnabled, setDuplicatesEnabled] = useState(autoModSettings.autoModDuplicatesEnabled);
  const [duplicatesTimeframe, setDuplicatesTimeframe] = useState(autoModSettings.autoModDuplicatesTimeframe);
  const [duplicatesAction, setDuplicatesAction] = useState(autoModSettings.autoModDuplicatesAction);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    if (!bannedWords.includes(newWord.trim().toLowerCase())) {
      setBannedWords([...bannedWords, newWord.trim().toLowerCase()]);
    }
    setNewWord("");
  };

  const addDomain = () => {
    if (newDomain && !linksWhitelist.includes(newDomain)) {
      setLinksWhitelist([...linksWhitelist, newDomain]);
      setNewDomain('');
    }
  };

  const handleSave = () => {
    setError('');
    startTransition(async () => {
      try {
        await updateModerationSettings(discordId, bannedWords, antiSpam);
        await updateAutoModSettings(discordId, {
          autoModEnabled,
          autoModSpamEnabled: spamEnabled, autoModSpamMaxMessages: spamMaxMessages,
          autoModSpamTimeframe: spamTimeframe, autoModSpamAction: spamAction,
          autoModSpamTimeoutDuration: spamTimeoutDuration,
          autoModCapsEnabled: capsEnabled, autoModCapsThreshold: capsThreshold,
          autoModCapsMinLength: capsMinLength, autoModCapsAction: capsAction,
          autoModLinksEnabled: linksEnabled, autoModLinksWhitelist: linksWhitelist,
          autoModLinksAction: linksAction,
          autoModInvitesEnabled: invitesEnabled, autoModInvitesAction: invitesAction,
          autoModMentionsEnabled: mentionsEnabled, autoModMentionsMax: mentionsMax,
          autoModMentionsAction: mentionsAction,
          autoModEmojisEnabled: emojisEnabled, autoModEmojisMax: emojisMax,
          autoModEmojisAction: emojisAction,
          autoModAttachmentsEnabled: attachmentsEnabled, autoModAttachmentsAction: attachmentsAction,
          autoModWhitelistChannels: whitelistChannels, autoModWhitelistRoles: whitelistRoles,
          autoModDuplicatesEnabled: duplicatesEnabled, autoModDuplicatesTimeframe: duplicatesTimeframe,
          autoModDuplicatesAction: duplicatesAction,
        });
        setSaved(true);
        showToast('Settings saved');
        setTimeout(() => setSaved(false), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to save settings');
      }
    });
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}

      <p className="text-xs font-semibold uppercase tracking-wider pb-3" style={{ color: "#A8A9A2", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        Moderation Rules
      </p>

      {/* Advanced Auto-Mod Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
            <ShieldAlert className="w-4 h-4" style={{ color: "#F5F4F5" }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Advanced Auto-Mod</h4>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Enable comprehensive auto-moderation rules</p>
          </div>
        </div>
        <ToggleSwitch enabled={autoModEnabled} onChange={setAutoModEnabled} />
      </div>

      {/* Anti-Spam Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
            <ShieldAlert className="w-4 h-4" style={{ color: "#F5F4F5" }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Anti-Spam Protection</h4>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Automatically warns users who send messages too quickly.</p>
          </div>
        </div>
        <ToggleSwitch enabled={antiSpam} onChange={setAntiSpam} />
      </div>

      {/* Banned Words */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TextQuote className="w-4 h-4" style={{ color: "#1FA7BB" }} />
          <div>
            <h4 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Banned Words</h4>
            <p className="text-xs" style={{ color: "#A8A9A2" }}>Any message containing these words will be instantly deleted.</p>
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <form onSubmit={handleAddWord} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Enter a word to block..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
              Add
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {bannedWords.length === 0 ? (
              <p className="text-xs py-1" style={{ color: "#A8A9A2" }}>No words banned yet.</p>
            ) : bannedWords.map((word) => (
              <div key={word} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                {word}
                <button onClick={() => setBannedWords(bannedWords.filter(w => w !== word))}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Rules */}
      {autoModEnabled && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider pb-2" style={{ color: "#A8A9A2", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Advanced Rules</p>

          <RuleCard title="Spam Detection" description="Prevent users from sending too many messages quickly" enabled={spamEnabled} onToggle={() => setSpamEnabled(!spamEnabled)} icon="??">
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Max Messages" value={spamMaxMessages} onChange={setSpamMaxMessages} min={2} max={20} />
              <NumberInput label="Timeframe (sec)" value={spamTimeframe} onChange={setSpamTimeframe} min={1} max={60} />
            </div>
            <ActionSelect value={spamAction} onChange={setSpamAction} />
            {spamAction === 'timeout' && (
              <NumberInput label="Timeout Duration (sec)" value={spamTimeoutDuration} onChange={setSpamTimeoutDuration} min={60} max={3600} />
            )}
          </RuleCard>

          <RuleCard title="Caps Filter" description="Block messages with excessive uppercase letters" enabled={capsEnabled} onToggle={() => setCapsEnabled(!capsEnabled)} icon="??">
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Threshold (%)" value={capsThreshold} onChange={setCapsThreshold} min={50} max={100} hint={`${capsThreshold}% or more caps = blocked`} />
              <NumberInput label="Min Length" value={capsMinLength} onChange={setCapsMinLength} min={5} max={50} hint="Ignore shorter messages" />
            </div>
            <ActionSelect value={capsAction} onChange={setCapsAction} />
          </RuleCard>

          <RuleCard title="Link Filter" description="Block links except whitelisted domains" enabled={linksEnabled} onToggle={() => setLinksEnabled(!linksEnabled)} icon="??">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Whitelisted Domains</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="example.com" style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDomain(); } }} />
                <button type="button" onClick={addDomain} className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-all" style={{ background: "#1FA7BB", color: "#101012" }}>
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {linksWhitelist.map((domain) => (
                  <div key={domain} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F4F5" }}>
                    {domain}
                    <button type="button" onClick={() => setLinksWhitelist(linksWhitelist.filter(d => d !== domain))}>
                      <Trash2 className="w-3 h-3" style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                ))}
                {linksWhitelist.length === 0 && <p className="text-xs" style={{ color: "#A8A9A2" }}>All links will be blocked</p>}
              </div>
            </div>
            <ActionSelect value={linksAction} onChange={setLinksAction} />
          </RuleCard>

          <RuleCard title="Discord Invite Filter" description="Block Discord server invites" enabled={invitesEnabled} onToggle={() => setInvitesEnabled(!invitesEnabled)} icon="??">
            <ActionSelect value={invitesAction} onChange={setInvitesAction} />
          </RuleCard>

          <RuleCard title="Mention Spam" description="Limit @mentions per message" enabled={mentionsEnabled} onToggle={() => setMentionsEnabled(!mentionsEnabled)} icon="@">
            <NumberInput label="Max Mentions" value={mentionsMax} onChange={setMentionsMax} min={1} max={20} />
            <ActionSelect value={mentionsAction} onChange={setMentionsAction} />
          </RuleCard>

          <RuleCard title="Emoji Spam" description="Limit emojis per message" enabled={emojisEnabled} onToggle={() => setEmojisEnabled(!emojisEnabled)} icon="??">
            <NumberInput label="Max Emojis" value={emojisMax} onChange={setEmojisMax} min={1} max={50} />
            <ActionSelect value={emojisAction} onChange={setEmojisAction} />
          </RuleCard>

          <RuleCard title="Attachment Filter" description="Block all file attachments" enabled={attachmentsEnabled} onToggle={() => setAttachmentsEnabled(!attachmentsEnabled)} icon="??">
            <ActionSelect value={attachmentsAction} onChange={setAttachmentsAction} />
          </RuleCard>

          <RuleCard title="Duplicate Messages" description="Prevent sending the same message repeatedly" enabled={duplicatesEnabled} onToggle={() => setDuplicatesEnabled(!duplicatesEnabled)} icon="??">
            <NumberInput label="Timeframe (sec)" value={duplicatesTimeframe} onChange={setDuplicatesTimeframe} min={10} max={300} hint="Block duplicates within this time" />
            <ActionSelect value={duplicatesAction} onChange={setDuplicatesAction} />
          </RuleCard>

          {/* Whitelist */}
          <div className="rounded-xl p-4 space-y-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8A9A2" }}>?? Whitelist (Bypass Auto-Mod)</p>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Whitelisted Channels</label>
              <select multiple value={whitelistChannels} onChange={(e) => setWhitelistChannels(Array.from(e.target.selectedOptions, o => o.value))}
                className="h-28" style={{ ...selectStyle }}>
                {channels?.map((c) => <option key={c.id} value={c.id} style={{ background: "#121315" }}># {c.name}</option>)}
              </select>
              <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Whitelisted Roles</label>
              <select multiple value={whitelistRoles} onChange={(e) => setWhitelistRoles(Array.from(e.target.selectedOptions, o => o.value))}
                className="h-28" style={{ ...selectStyle }}>
                {roles?.map((r) => <option key={r.id} value={r.id} style={{ background: "#121315" }}>{r.name}</option>)}
              </select>
              <p className="text-xs mt-1" style={{ color: "#A8A9A2" }}>Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          {isPending ? <Save size={14} className="animate-pulse" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {isPending ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
        {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>? Settings saved</span>}
      </div>
    </div>
  );
}
