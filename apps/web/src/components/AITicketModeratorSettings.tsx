"use client";

import { useState } from "react";
import { updateAITicketSettings } from "@/actions/modules";
import {
  Bot,
  Check,
  Loader2,
  Sparkles,
  Shield,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Flame,
  Info
} from "lucide-react";
import { toast } from "sonner";

interface AITicketModeratorSettingsProps {
  discordId: string;
  initialEnabled: boolean;
  initialStaffRoleIds: string[];
  initialPersonality: string | null;
  initialMaxMessages: number;
  initialAutoDelay: number;
  initialEscalateAfter: number;
  initialConfidenceMin: number;
  initialEscalateRoleIds: string[];
  initialKnowledgeBase: unknown;
  initialBlacklist: string[];
  initialWhitelist: string[];
  initialLanguage: string;
  serverRoles: Array<{ id: string; name: string }>;
}

const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-inherit";
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#F5F4F5",
};
const labelStyle = {
  color: "#A8A9A2",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const PRESET_PERSONALITIES = [
  {
    id: "friendly",
    label: "😊 Friendly",
    prompt:
      "You are a friendly and approachable AI support assistant! Be warm, use emojis 😊, and make users feel welcome. Keep responses conversational but helpful.",
  },
  {
    id: "professional",
    label: "💼 Professional",
    prompt:
      "You are a professional and helpful AI support moderator. Be clear, concise, and always maintain a respectful tone. Use emojis sparingly.",
  },
  {
    id: "casual",
    label: "⚡ Casual",
    prompt:
      "Hey! You're a chill AI support bot. Keep it casual and friendly, use emojis when it feels right, and don't be too formal. Help users out like a friend would!",
  },
];

export function AITicketModeratorSettings({
  discordId,
  initialEnabled,
  initialStaffRoleIds,
  initialPersonality,
  initialMaxMessages,
  initialAutoDelay,
  initialEscalateAfter,
  initialConfidenceMin,
  initialEscalateRoleIds,
  initialKnowledgeBase,
  initialBlacklist,
  initialWhitelist,
  initialLanguage,
  serverRoles,
}: AITicketModeratorSettingsProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [staffRoleIds, setStaffRoleIds] = useState<string[]>(initialStaffRoleIds || []);
  const [personality, setPersonality] = useState(
    initialPersonality || PRESET_PERSONALITIES[0].prompt
  );
  const [maxMessages, setMaxMessages] = useState(initialMaxMessages);
  const [autoDelay, setAutoDelay] = useState(initialAutoDelay);
  const [escalateAfter, setEscalateAfter] = useState(initialEscalateAfter);
  const [confidenceMin, setConfidenceMin] = useState(initialConfidenceMin);
  const [escalateRoleIds, setEscalateRoleIds] = useState<string[]>(initialEscalateRoleIds || []);
  const [blacklist, setBlacklist] = useState<string[]>(initialBlacklist || []);
  const [whitelist, setWhitelist] = useState<string[]>(initialWhitelist || []);
  const [language, setLanguage] = useState(initialLanguage || "auto");

  const [newStaffRoleId, setNewStaffRoleId] = useState("");
  const [newEscalateRoleId, setNewEscalateRoleId] = useState("");
  const [blacklistInput, setBlacklistInput] = useState("");
  const [whitelistInput, setWhitelistInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAITicketSettings(discordId, {
        enabled,
        staffRoleIds,
        personality: personality.trim() || null,
        maxMessages,
        autoDelay,
        escalateAfter,
        confidenceMin,
        escalateRoleIds,
        knowledgeBase: initialKnowledgeBase,
        blacklist,
        whitelist,
        language,
      });
      setShowSuccess(true);
      toast.success("AI Moderator settings saved!");
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save AI settings");
    } finally {
      setIsSaving(false);
    }
  };

  const addStaffRole = () => {
    if (!newStaffRoleId || staffRoleIds.includes(newStaffRoleId)) return;
    setStaffRoleIds([...staffRoleIds, newStaffRoleId]);
    setNewStaffRoleId("");
  };

  const removeStaffRole = (roleId: string) => {
    setStaffRoleIds(staffRoleIds.filter((id) => id !== roleId));
  };

  const addEscalateRole = () => {
    if (!newEscalateRoleId || escalateRoleIds.includes(newEscalateRoleId)) return;
    setEscalateRoleIds([...escalateRoleIds, newEscalateRoleId]);
    setNewEscalateRoleId("");
  };

  const removeEscalateRole = (roleId: string) => {
    setEscalateRoleIds(escalateRoleIds.filter((id) => id !== roleId));
  };

  const addBlacklist = () => {
    const trimmed = blacklistInput.trim().toLowerCase();
    if (!trimmed || blacklist.includes(trimmed)) return;
    setBlacklist([...blacklist, trimmed]);
    setBlacklistInput("");
  };

  const removeBlacklist = (word: string) => {
    setBlacklist(blacklist.filter((w) => w !== word));
  };

  const addWhitelist = () => {
    const trimmed = whitelistInput.trim().toLowerCase();
    if (!trimmed || whitelist.includes(trimmed)) return;
    setWhitelist([...whitelist, trimmed]);
    setWhitelistInput("");
  };

  const removeWhitelist = (word: string) => {
    setWhitelist(whitelist.filter((w) => w !== word));
  };

  return (
    <div className="space-y-6">
      {/* Enable Toggle Header */}
      <div
        className="p-4 rounded-xl flex items-center justify-between transition-colors"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>
              AI Ticket Moderator
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>
              Let AI automatically understand and answer member questions in support tickets.
            </p>
          </div>
        </div>

        {/* Clean teal switch matching the rest of the dashboard */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(!enabled)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 cursor-pointer"
          style={{ background: enabled ? "#1FA7BB" : "rgba(255,255,255,0.1)" }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Info explanation banner */}
      <div
        className="flex gap-3 p-4 rounded-xl"
        style={{
          background: "rgba(31,167,187,0.06)",
          border: "1px solid rgba(31,167,187,0.15)",
        }}
      >
        <Info size={16} style={{ color: "#1FA7BB", flexShrink: 0, marginTop: 2 }} />
        <div className="text-xs space-y-1" style={{ color: "#A8A9A2" }}>
          <p className="font-semibold" style={{ color: "#F5F4F5" }}>
            How the AI Moderator operates:
          </p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Reads customer messages and answers questions using server knowledge and past tickets.</li>
            <li>Automatically steps back as soon as a staff member types in the ticket.</li>
            <li>Escalates directly to your support team if uncertain or if critical keywords appear.</li>
          </ul>
        </div>
      </div>

      {enabled && (
        <div className="space-y-6 pt-2">
          {/* AI Personality */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
                  <Sparkles size={14} style={{ color: "#1FA7BB" }} /> AI Personality & Tone
                </h4>
                <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>
                  Define how the assistant interacts with users when replying to tickets.
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex gap-2 flex-wrap">
              {PRESET_PERSONALITIES.map((preset) => {
                const isSelected = personality.trim() === preset.prompt.trim();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPersonality(preset.prompt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: isSelected ? "rgba(31,167,187,0.15)" : "rgba(255,255,255,0.03)",
                      border: isSelected ? "1px solid rgba(31,167,187,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      color: isSelected ? "#1FA7BB" : "#A8A9A2",
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Textarea */}
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Describe how the AI should behave..."
              rows={4}
              className={`${inputCls} resize-none leading-relaxed`}
              style={inputStyle}
            />
          </div>

          {/* Response & Escalation Parameters Grid */}
          <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: "#F5F4F5" }}>
              <Clock size={14} style={{ color: "#1FA7BB" }} /> Response & Escalation Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delay */}
              <div className="space-y-1.5">
                <label className="block" style={labelStyle}>
                  Auto-Respond Delay (Seconds)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={autoDelay}
                  onChange={(e) => setAutoDelay(parseInt(e.target.value) || 0)}
                  className={inputCls}
                  style={inputStyle}
                />
                <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
                  Delay before AI responds to allow human staff time to intervene.
                </p>
              </div>

              {/* Max Messages */}
              <div className="space-y-1.5">
                <label className="block" style={labelStyle}>
                  Max AI Messages Per Ticket
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={maxMessages}
                  onChange={(e) => setMaxMessages(parseInt(e.target.value) || 1)}
                  className={inputCls}
                  style={inputStyle}
                />
                <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
                  Automatically hands ticket over to staff after this message limit.
                </p>
              </div>

              {/* Min Confidence */}
              <div className="space-y-1.5">
                <label className="block" style={labelStyle}>
                  Min Confidence Threshold (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={confidenceMin}
                  onChange={(e) => setConfidenceMin(parseInt(e.target.value) || 0)}
                  className={inputCls}
                  style={inputStyle}
                />
                <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
                  Escalates to staff if confidence in the answer is below this %.
                </p>
              </div>

              {/* Escalation Timeout */}
              <div className="space-y-1.5">
                <label className="block" style={labelStyle}>
                  Auto-Escalate Open Tickets (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={1440}
                  value={escalateAfter}
                  onChange={(e) => setEscalateAfter(parseInt(e.target.value) || 1)}
                  className={inputCls}
                  style={inputStyle}
                />
                <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
                  Pings support staff if a ticket remains open and unresolved.
                </p>
              </div>

              {/* Response Language */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block" style={labelStyle}>
                  AI Response Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`${inputCls} cursor-pointer`}
                  style={inputStyle}
                >
                  <option value="auto" style={{ background: "#121315", color: "#F5F4F5" }}>🌐 Auto-Detect (Reply in the same language as the user)</option>
                  <option value="de" style={{ background: "#121315", color: "#F5F4F5" }}>🇩🇪 German (Deutsch)</option>
                  <option value="en" style={{ background: "#121315", color: "#F5F4F5" }}>🇬🇧 English</option>
                  <option value="fr" style={{ background: "#121315", color: "#F5F4F5" }}>🇫🇷 French (Français)</option>
                  <option value="es" style={{ background: "#121315", color: "#F5F4F5" }}>🇪🇸 Spanish (Español)</option>
                </select>
                <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
                  Preferred language for automated ticket responses.
                </p>
              </div>
            </div>
          </div>

          {/* Staff Roles (Disable AI when they write) */}
          <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1" style={{ color: "#F5F4F5" }}>
              <Shield size={14} style={{ color: "#1FA7BB" }} /> Staff Roles
            </h4>
            <p className="text-xs mb-3" style={{ color: "#A8A9A2" }}>
              When a user with any of these roles writes in a ticket, the AI assistant will automatically stop responding in that channel.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {staffRoleIds.length === 0 ? (
                <span className="text-xs italic" style={{ color: "#A8A9A2" }}>
                  No staff roles configured.
                </span>
              ) : (
                staffRoleIds.map((id) => {
                  const roleName = serverRoles.find((r) => r.id === id)?.name || id;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        background: "rgba(31,167,187,0.1)",
                        border: "1px solid rgba(31,167,187,0.2)",
                        color: "#1FA7BB",
                      }}
                    >
                      @{roleName}
                      <button onClick={() => removeStaffRole(id)} className="hover:opacity-75">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={newStaffRoleId}
                onChange={(e) => setNewStaffRoleId(e.target.value)}
                className={`${inputCls} cursor-pointer`}
                style={inputStyle}
              >
                <option value="" style={{ background: "#121315", color: "#A8A9A2" }}>
                  Select a staff role to add...
                </option>
                {serverRoles
                  .filter((r) => r.name !== "@everyone" && !staffRoleIds.includes(r.id))
                  .map((role) => (
                    <option key={role.id} value={role.id} style={{ background: "#121315", color: "#F5F4F5" }}>
                      @{role.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addStaffRole}
                disabled={!newStaffRoleId}
                className="p-2.5 rounded-xl disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center flex-shrink-0"
                style={{ background: "#1FA7BB", color: "#101012" }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Escalation Ping Roles */}
          <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1" style={{ color: "#F5F4F5" }}>
              <Flame size={14} style={{ color: "#F59E0B" }} /> Escalation Roles (Ping on Handover)
            </h4>
            <p className="text-xs mb-3" style={{ color: "#A8A9A2" }}>
              These roles will be pinged directly inside the ticket when the AI escalates to human assistance.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {escalateRoleIds.length === 0 ? (
                <span className="text-xs italic" style={{ color: "#A8A9A2" }}>
                  No escalation roles selected (ticket will escalate silently).
                </span>
              ) : (
                escalateRoleIds.map((id) => {
                  const roleName = serverRoles.find((r) => r.id === id)?.name || id;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.2)",
                        color: "#F59E0B",
                      }}
                    >
                      @{roleName}
                      <button onClick={() => removeEscalateRole(id)} className="hover:opacity-75">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={newEscalateRoleId}
                onChange={(e) => setNewEscalateRoleId(e.target.value)}
                className={`${inputCls} cursor-pointer`}
                style={inputStyle}
              >
                <option value="" style={{ background: "#121315", color: "#A8A9A2" }}>
                  Select a role to ping...
                </option>
                {serverRoles
                  .filter((r) => r.name !== "@everyone" && !escalateRoleIds.includes(r.id))
                  .map((role) => (
                    <option key={role.id} value={role.id} style={{ background: "#121315", color: "#F5F4F5" }}>
                      @{role.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addEscalateRole}
                disabled={!newEscalateRoleId}
                className="p-2.5 rounded-xl disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center flex-shrink-0"
                style={{ background: "#F59E0B", color: "#101012" }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Blacklist & Urgent Keywords (2 columns) */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Blacklist */}
            <div
              className="p-4 rounded-xl space-y-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#EF4444" }}>
                  <AlertTriangle size={13} /> Blacklist Keywords
                </h4>
                <p className="text-[11px] mt-0.5" style={{ color: "#A8A9A2" }}>
                  AI will never answer tickets containing these terms (e.g. refund, ban appeal).
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. refund, appeal..."
                  value={blacklistInput}
                  onChange={(e) => setBlacklistInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBlacklist())}
                  className={`${inputCls} text-xs`}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={addBlacklist}
                  disabled={!blacklistInput.trim()}
                  className="px-3 rounded-xl text-xs font-medium transition-all disabled:opacity-40"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto custom-scrollbar">
                {blacklist.length === 0 ? (
                  <span className="text-[11px] italic" style={{ color: "#71717A" }}>
                    No blacklist keywords configured.
                  </span>
                ) : (
                  blacklist.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#EF4444",
                      }}
                    >
                      {word}
                      <button onClick={() => removeBlacklist(word)} className="hover:opacity-75">
                        <Trash2 size={10} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Whitelist / Urgent */}
            <div
              className="p-4 rounded-xl space-y-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#F59E0B" }}>
                  <Flame size={13} /> Urgent Keywords
                </h4>
                <p className="text-[11px] mt-0.5" style={{ color: "#A8A9A2" }}>
                  Tickets mentioning these terms escalate to human support immediately.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. urgent, emergency..."
                  value={whitelistInput}
                  onChange={(e) => setWhitelistInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addWhitelist())}
                  className={`${inputCls} text-xs`}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={addWhitelist}
                  disabled={!whitelistInput.trim()}
                  className="px-3 rounded-xl text-xs font-medium transition-all disabled:opacity-40"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto custom-scrollbar">
                {whitelist.length === 0 ? (
                  <span className="text-[11px] italic" style={{ color: "#71717A" }}>
                    No urgent keywords configured.
                  </span>
                ) : (
                  whitelist.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.2)",
                        color: "#F59E0B",
                      }}
                    >
                      {word}
                      <button onClick={() => removeWhitelist(word)} className="hover:opacity-75">
                        <Trash2 size={10} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : showSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
          {showSuccess ? "Saved!" : "Save Settings"}
        </button>
        {showSuccess && (
          <span className="text-xs font-medium" style={{ color: "#22C55E" }}>
            ✓ AI settings saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
