"use client";

import { useState } from "react";
import { updateTicketSettings } from "@/actions/modules";
import { Ticket, Trash2, Plus, Check, Loader2, Info, Palette, List, ChevronDown, ChevronUp } from "lucide-react";
import { CustomSelect } from "./CustomSelect";
import { EmojiPicker } from "./EmojiPicker";
import { ToggleSwitch } from "./Toggle";

interface Category {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface TicketReason {
  label: string;
  value: string;
  emoji?: string;
  description?: string;
}

interface TicketConfigProps {
  discordId: string;
  initialCategoryId: string | null;
  initialSupportRoleIds: string[];
  initialPanelTitle: string;
  initialPanelDescription: string;
  initialPanelColor: string;
  initialButtonLabel: string;
  initialButtonEmoji: string;
  initialUseDropdown?: boolean;
  initialReasons?: TicketReason[];
  categories: Category[];
  serverRoles: Role[];
}

const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-inherit";
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#F5F4F5",
};
const labelStyle = { color: "#A8A9A2", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" };

const COLOR_PRESETS = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Slate", value: "#64748b" },
];

/** Renders Discord-flavored markdown to safe React JSX spans. */
function renderDiscordMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // split by **bold**, *italic*, __underline__, `code`
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|`[^`]+`)/);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={j} className="text-white font-black">{part.slice(2, -2)}</strong>;
      if (part.startsWith("*") && part.endsWith("*"))
        return <em key={j}>{part.slice(1, -1)}</em>;
      if (part.startsWith("__") && part.endsWith("__"))
        return <span key={j} className="underline">{part.slice(2, -2)}</span>;
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={j} className="bg-white/10 rounded px-1 font-mono text-xs">{part.slice(1, -1)}</code>;
      return <span key={j}>{part}</span>;
    });
    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function TicketConfig({
  discordId,
  initialCategoryId,
  initialSupportRoleIds,
  initialPanelTitle,
  initialPanelDescription,
  initialPanelColor,
  initialButtonLabel,
  initialButtonEmoji,
  initialUseDropdown = false,
  initialReasons = [],
  categories,
  serverRoles,
}: TicketConfigProps) {
  const [categoryId, setCategoryId] = useState(initialCategoryId || "");
  const [supportRoleIds, setSupportRoleIds] = useState<string[]>(initialSupportRoleIds || []);
  const [newRoleId, setNewRoleId] = useState("");
  const [panelTitle, setPanelTitle] = useState(initialPanelTitle || "🎫 Support Tickets");
  const [panelDescription, setPanelDescription] = useState(initialPanelDescription || "Need help or have a question?\n\nClick the button below to open a **private support ticket**.");
  const [panelColor, setPanelColor] = useState(initialPanelColor || "#6366f1");
  const [buttonLabel, setButtonLabel] = useState(initialButtonLabel || "Open a Ticket");
  const [buttonEmoji, setButtonEmoji] = useState(initialButtonEmoji || "🎫");
  const [useDropdown, setUseDropdown] = useState(initialUseDropdown);
  const [reasons, setReasons] = useState<TicketReason[]>(
    initialReasons && initialReasons.length > 0 ? initialReasons : [
      { label: "General Support", value: "general", emoji: "❓", description: "General questions and support" },
      { label: "Bug Report", value: "bug", emoji: "🐛", description: "Report a bug or issue" },
      { label: "Feature Request", value: "feature", emoji: "✨", description: "Suggest a new feature" },
    ]
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingReasonIndex, setEditingReasonIndex] = useState<number | null>(null);
  const [previewTab, setPreviewTab] = useState<"panel" | "channel">("panel");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTicketSettings(
        discordId, 
        categoryId || null, 
        supportRoleIds, 
        panelTitle, 
        panelDescription, 
        panelColor, 
        buttonLabel.trim() || "Open a Ticket", 
        buttonEmoji.trim() || "🎫",
        useDropdown,
        reasons
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const addRole = () => {
    if (!newRoleId || supportRoleIds.includes(newRoleId)) return;
    setSupportRoleIds([...supportRoleIds, newRoleId]);
    setNewRoleId("");
  };

  const removeRole = (id: string) => {
    setSupportRoleIds(supportRoleIds.filter((r) => r !== id));
  };

  const addReason = () => {
    setReasons([...reasons, { label: "New Reason", value: `reason-${Date.now()}`, emoji: "📝" }]);
  };

  const removeReason = (index: number) => {
    setReasons(reasons.filter((_, i) => i !== index));
  };

  const updateReason = (index: number, field: keyof TicketReason, value: string) => {
    const updated = [...reasons];
    updated[index] = { ...updated[index], [field]: value };
    setReasons(updated);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div
        className="flex gap-3 p-4 rounded-xl"
        style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}
      >
        <Info size={15} style={{ color: "#1FA7BB", flexShrink: 0, marginTop: 2 }} />
        <div className="text-xs leading-relaxed" style={{ color: "#A8A9A2" }}>
          After saving, use{" "}
          <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}>
            /ticket panel
          </code>{" "}
          in any Discord channel to post the ticket panel.
        </div>
      </div>

      {/* Panel Appearance */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <Palette size={14} style={{ color: "#1FA7BB" }} />
            <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Panel Appearance</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>
            <span>✨ Discord Components V2</span>
          </div>
        </div>

        {/* Preview Selector Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setPreviewTab("panel")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: previewTab === "panel" ? "rgba(31,167,187,0.15)" : "rgba(255,255,255,0.03)",
              border: previewTab === "panel" ? "1px solid rgba(31,167,187,0.3)" : "1px solid rgba(255,255,255,0.06)",
              color: previewTab === "panel" ? "#1FA7BB" : "#A8A9A2",
            }}
          >
            📩 Server Panel (/ticket panel)
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("channel")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: previewTab === "channel" ? "rgba(31,167,187,0.15)" : "rgba(255,255,255,0.03)",
              border: previewTab === "channel" ? "1px solid rgba(31,167,187,0.3)" : "1px solid rgba(255,255,255,0.06)",
              color: previewTab === "channel" ? "#1FA7BB" : "#A8A9A2",
            }}
          >
            🎫 Ticket Channel (#ticket-...)
          </button>
        </div>

        {/* Live Preview - Discord Components V2 Container */}
        {previewTab === "panel" ? (
          <div
            className="rounded-2xl p-4 mb-5 transition-all relative overflow-hidden"
            style={{
              background: "#2B2D31",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: panelColor }} />

            {/* Header & Description */}
            <div className="pt-1">
              <h4 className="text-base font-bold text-white tracking-tight">
                {panelTitle || "🎫 Support Tickets"}
              </h4>
              <p className="text-xs leading-relaxed text-[#DBDEE1] mt-1.5 whitespace-pre-wrap">
                {renderDiscordMarkdown(panelDescription || "Need help or have a question?\n\nClick the button below to open a **private support ticket**.")}
              </p>
            </div>

            {/* Separator */}
            <div className="h-[1px] bg-white/10 my-3" />

            {/* Footer / Subtext */}
            <p className="text-[11px] font-medium text-[#949BA4]">
              One ticket per user at a time.
            </p>

            {/* Separator */}
            <div className="h-[1px] bg-white/10 my-3" />

            {/* Action Row */}
            {useDropdown && reasons.length > 0 ? (
              <div
                className="rounded-lg px-3 py-2.5 flex items-center justify-between text-xs transition-colors cursor-pointer"
                style={{
                  background: "#1E1F22",
                  border: "1px solid #3B3E45",
                  color: "#DBDEE1",
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{reasons[0]?.emoji || "❓"}</span>
                  <span className="font-medium text-white">{reasons[0]?.label || "General Support"}</span>
                </div>
                <ChevronDown size={14} className="text-[#949BA4]" />
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold text-white shadow-sm transition-all"
                style={{ backgroundColor: panelColor }}
              >
                {buttonEmoji && <span className="text-sm">{buttonEmoji}</span>}
                <span>{buttonLabel || "Open a Ticket"}</span>
              </button>
            )}
          </div>
        ) : (
          <div
            className="rounded-2xl p-4 mb-5 transition-all relative overflow-hidden"
            style={{
              background: "#2B2D31",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: panelColor }} />

            {/* Header & Content */}
            <div className="pt-1">
              <h4 className="text-base font-bold text-white tracking-tight">
                🎫 Ticket Opened: {reasons[0]?.label || "General Support"}
              </h4>
              <div className="text-xs leading-relaxed text-[#DBDEE1] mt-2 space-y-1.5">
                <p>Hey <span className="text-[#5865F2] font-semibold bg-[#5865F2]/10 px-1 rounded">@User</span>, welcome to your support ticket!</p>
                <p><strong className="text-white">Reason:</strong> {reasons[0]?.label || "General Support"}</p>
                <p className="text-[#A8A9A2]">Please describe your issue and a team member will be with you shortly.</p>
                <p className="text-[#A8A9A2]">To close this ticket, click the button below.</p>
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1px] bg-white/10 my-3" />

            {/* Footer / Subtext */}
            <p className="text-[11px] font-medium text-[#949BA4]">
              Ticket created by User#0001
            </p>

            {/* Separator */}
            <div className="h-[1px] bg-white/10 my-3" />

            {/* Close Ticket Button */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white shadow-sm"
              style={{ backgroundColor: "#DA373C" }}
            >
              <span>🔒</span>
              <span>Close Ticket</span>
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>Panel Title</label>
            <input
              type="text"
              value={panelTitle}
              onChange={(e) => setPanelTitle(e.target.value)}
              placeholder="🎫 Support Tickets"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>Panel Description</label>
            <textarea
              value={panelDescription}
              onChange={(e) => setPanelDescription(e.target.value)}
              rows={3}
              placeholder="Describe how users should use the ticket system..."
              className={inputCls}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Button */}
          <div className="grid grid-cols-2 gap-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <label className="block mb-1.5" style={labelStyle}>Button Label</label>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                placeholder="Open a Ticket"
                maxLength={80}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div className="relative">
              <label className="block mb-1.5" style={labelStyle}>Button Emoji</label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-12 h-10 rounded-xl text-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {buttonEmoji || "🎫"}
              </button>
              {showEmojiPicker && (
                <EmojiPicker onSelect={(emoji) => { setButtonEmoji(emoji); setShowEmojiPicker(false); }} onClose={() => setShowEmojiPicker(false)} guildId={discordId} />
              )}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block mb-2" style={labelStyle}>Accent Color</label>
            <div className="flex flex-wrap gap-2 items-center">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setPanelColor(preset.value)}
                  title={preset.label}
                  className="w-7 h-7 rounded-lg transition-all"
                  style={{
                    backgroundColor: preset.value,
                    outline: panelColor === preset.value ? `2px solid ${preset.value}` : "none",
                    outlineOffset: 2,
                    opacity: panelColor === preset.value ? 1 : 0.6,
                  }}
                />
              ))}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <input type="color" value={panelColor} onChange={(e) => setPanelColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
                <span className="text-xs font-mono" style={{ color: "#A8A9A2" }}>{panelColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <label className="block mb-1.5" style={labelStyle}>Ticket Category</label>
        <p className="text-xs mb-2" style={{ color: "#A8A9A2" }}>New ticket channels will be created inside this Discord category.</p>
        <CustomSelect value={categoryId} onChange={setCategoryId} options={categories} placeholder="Select a Category..." />
      </div>

      {/* Support Roles */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>Support Roles</h3>
        <p className="text-xs mb-3" style={{ color: "#A8A9A2" }}>Members with these roles can see and manage all ticket channels.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {supportRoleIds.length === 0 && (
            <span className="text-xs italic" style={{ color: "#A8A9A2" }}>No support roles — only admins can see tickets.</span>
          )}
          {supportRoleIds.map((id) => {
            const roleName = serverRoles.find((r) => r.id === id)?.name || id;
            return (
              <div key={id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(31,167,187,0.1)", border: "1px solid rgba(31,167,187,0.2)", color: "#1FA7BB" }}>
                @{roleName}
                <button onClick={() => removeRole(id)}><Trash2 size={11} /></button>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <CustomSelect value={newRoleId} onChange={setNewRoleId} options={serverRoles.filter((r) => r.name !== "@everyone" && !supportRoleIds.includes(r.id))} placeholder="Add a Support Role..." />
          </div>
          <button onClick={addRole} disabled={!newRoleId} className="p-2.5 rounded-xl disabled:opacity-40 hover:opacity-90 transition-all" style={{ background: "#1FA7BB", color: "#101012" }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Dropdown Mode */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
              <List size={14} style={{ color: "#1FA7BB" }} /> Dropdown Menu Mode
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Let users select a reason from a dropdown menu.</p>
          </div>
          <ToggleSwitch enabled={useDropdown} onChange={setUseDropdown} />
        </div>

        {useDropdown && (
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Ticket Reasons</span>
              <button onClick={addReason} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-all" style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}>
                <Plus size={12} /> Add Reason
              </button>
            </div>
            {reasons.length === 0 && (
              <p className="text-xs text-center py-6" style={{ color: "#A8A9A2" }}>No reasons configured. Add at least one to use dropdown mode.</p>
            )}
            {reasons.map((reason, index) => (
              <div key={index} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  style={{ background: editingReasonIndex === index ? "rgba(31,167,187,0.06)" : "rgba(255,255,255,0.02)" }}
                  onClick={() => setEditingReasonIndex(editingReasonIndex === index ? null : index)}
                >
                  <div className="flex items-center gap-2">
                    {editingReasonIndex === index ? <ChevronUp size={14} style={{ color: "#A8A9A2" }} /> : <ChevronDown size={14} style={{ color: "#A8A9A2" }} />}
                    <span className="text-base">{reason.emoji || "📝"}</span>
                    <span className="text-sm font-medium" style={{ color: "#F5F4F5" }}>{reason.label}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeReason(index); }}>
                    <Trash2 size={14} style={{ color: "#EF4444" }} />
                  </button>
                </div>
                {editingReasonIndex === index && (
                  <div className="p-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1.5" style={labelStyle}>Label</label>
                        <input type="text" value={reason.label} onChange={(e) => updateReason(index, "label", e.target.value)} placeholder="General Support" className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <label className="block mb-1.5" style={labelStyle}>Value (ID)</label>
                        <input type="text" value={reason.value} onChange={(e) => updateReason(index, "value", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="general" className={`${inputCls} font-mono`} style={inputStyle} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1.5" style={labelStyle}>Emoji</label>
                        <input type="text" value={reason.emoji || ""} onChange={(e) => updateReason(index, "emoji", e.target.value)} placeholder="📝" maxLength={2} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <label className="block mb-1.5" style={labelStyle}>Description</label>
                        <input type="text" value={reason.description || ""} onChange={(e) => updateReason(index, "description", e.target.value)} placeholder="Brief description..." className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : showSuccess ? <Check className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
          {showSuccess ? "Saved!" : "Save Configuration"}
        </button>
        {showSuccess && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>✓ Configuration saved</span>}
      </div>
    </div>
  );
}
