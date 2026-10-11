"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Trash2, Shield, FileText, AlertTriangle, Save, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

type Action = 'log' | 'delete' | 'warn';

interface AIDetectionConfigProps {
  discordId: string;
  initialThreshold: number;
  initialAction: Action;
  initialLogChannelId: string;
  initialDeleteChannelIds: string[];
  initialWhitelistRoleIds: string[];
  initialRequireLabel: boolean;
  channels: { id: string; name: string }[];
  roles: { id: string; name: string }[];
}

const selectStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5",
  fontSize: 13,
  outline: "none",
  cursor: "pointer",
};

export function AIDetectionConfig({
  discordId, initialThreshold, initialAction, initialLogChannelId,
  initialDeleteChannelIds, initialWhitelistRoleIds, initialRequireLabel,
  channels, roles,
}: AIDetectionConfigProps) {
  const [threshold, setThreshold] = useState(initialThreshold);
  const [action, setAction] = useState<Action>(initialAction);
  const [logChannelId, setLogChannelId] = useState(initialLogChannelId);
  const [deleteChannelIds, setDeleteChannelIds] = useState<string[]>(initialDeleteChannelIds);
  const [whitelistRoleIds, setWhitelistRoleIds] = useState<string[]>(initialWhitelistRoleIds);
  const [requireLabel, setRequireLabel] = useState(initialRequireLabel);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/guild/ai-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId, threshold, action, logChannelId, deleteChannelIds, whitelistRoleIds, requireLabel }),
      });
      if (res.ok) {
      setSaved(true);
      showToast('AI detection settings saved');
      setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Failed to save settings.");
      }
    } catch {
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const toggleDeleteChannel = (id: string) =>
    setDeleteChannelIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleWhitelistRole = (id: string) =>
    setWhitelistRoleIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider pb-4" style={{ color: "#A8A9A2", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        Detection Configuration
      </h2>

      {/* Threshold */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>
          Detection Threshold: <span style={{ color: "#1FA7BB" }}>{threshold}%</span>
        </label>
        <p className="text-xs mb-4" style={{ color: "#A8A9A2" }}>
          Images with an AI probability above this value will be flagged.
        </p>
        <Slider
          value={[threshold]}
          onValueChange={(value) => setThreshold(value[0])}
          min={50} max={95} step={5}
          className="mb-2"
        />
        <div className="flex justify-between text-xs mt-2" style={{ color: "#A8A9A2" }}>
          <span>50% (Low)</span>
          <span>70% (Recommended)</span>
          <span>95% (Strict)</span>
        </div>
      </div>

      {/* Action */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: "#F5F4F5" }}>
          Action on Detection
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'log' as Action, icon: <FileText className="w-5 h-5 mb-2" />, title: "Log Only", desc: "No action, document only", activeColor: "#1FA7BB" },
            { key: 'warn' as Action, icon: <AlertTriangle className="w-5 h-5 mb-2" />, title: "Warn User", desc: "User receives a warning", activeColor: "#F97316" },
            { key: 'delete' as Action, icon: <Trash2 className="w-5 h-5 mb-2" />, title: "Delete Image", desc: "Automatically delete image", activeColor: "#EF4444" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setAction(opt.key)}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: action === opt.key ? `${opt.activeColor}12` : "rgba(255,255,255,0.03)",
                border: `1px solid ${action === opt.key ? opt.activeColor + "40" : "rgba(255,255,255,0.08)"}`,
                color: action === opt.key ? opt.activeColor : "#A8A9A2",
              }}
            >
              {opt.icon}
              <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>{opt.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Log Channel */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>Log Channel</label>
        <p className="text-xs mb-2" style={{ color: "#A8A9A2" }}>
          Channel for AI detection logs with confidence score and image preview.
        </p>
        <select value={logChannelId} onChange={(e) => setLogChannelId(e.target.value)} style={selectStyle}>
          <option value="" style={{ background: "#121315" }}>No log channel</option>
          {channels.map((c) => (
            <option key={c.id} value={c.id} style={{ background: "#121315" }}>#{c.name}</option>
          ))}
        </select>
      </div>

      {/* Delete Channels */}
      {action === 'delete' && (
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>Monitored Channels (Auto-Delete)</label>
          <p className="text-xs mb-2" style={{ color: "#A8A9A2" }}>
            Images in these channels will be automatically deleted when AI is detected.
          </p>
          <div
            className="max-h-48 overflow-y-auto rounded-xl p-2 space-y-1"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
          >
            {channels.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: "#A8A9A2" }}>No channels available</p>
            ) : channels.map((c) => (
              <label key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={deleteChannelIds.includes(c.id)}
                  onChange={() => toggleDeleteChannel(c.id)}
                  className="rounded"
                  style={{ accentColor: "#1FA7BB" }}
                />
                <span className="text-sm" style={{ color: "#F5F4F5" }}>#{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Whitelist Roles */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>
          <Shield className="w-3.5 h-3.5 inline mr-1.5" style={{ color: "#1FA7BB" }} />
          Exempt Roles (Whitelist)
        </label>
        <p className="text-xs mb-2" style={{ color: "#A8A9A2" }}>
          Users with these roles will not be scanned (e.g. moderators).
        </p>
        <div
          className="max-h-48 overflow-y-auto rounded-xl p-2 space-y-1"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
        >
          {roles.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: "#A8A9A2" }}>No roles available</p>
          ) : roles.map((r) => (
            <label key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5">
              <input
                type="checkbox"
                checked={whitelistRoleIds.includes(r.id)}
                onChange={() => toggleWhitelistRole(r.id)}
                className="rounded"
                style={{ accentColor: "#1FA7BB" }}
              />
              <span className="text-sm" style={{ color: "#F5F4F5" }}>@{r.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Require Label */}
      <label
        className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
        style={{
          border: `1px solid ${requireLabel ? "rgba(31,167,187,0.3)" : "rgba(255,255,255,0.08)"}`,
          background: requireLabel ? "rgba(31,167,187,0.05)" : "rgba(255,255,255,0.02)",
        }}
      >
        <input
          type="checkbox"
          checked={requireLabel}
          onChange={(e) => setRequireLabel(e.target.checked)}
          className="mt-0.5 rounded"
          style={{ accentColor: "#1FA7BB" }}
        />
        <div>
          <span className="text-sm font-semibold block" style={{ color: "#F5F4F5" }}>
            Require AI Label
          </span>
          <span className="text-xs" style={{ color: "#A8A9A2" }}>
            Users must label AI images with "[AI]" or "🤖" in their message text.
          </span>
        </div>
      </label>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          {saving ? <Save size={14} className="animate-pulse" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
        {error && <span className="text-xs font-medium" style={{ color: "#EF4444" }}>{error}</span>}
        {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>✓ Settings saved</span>}
      </div>
    </div>
  );
}
