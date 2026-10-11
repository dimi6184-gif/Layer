"use client";

import { useState } from "react";
import { updateCustomEmojis } from "@/actions/custom-emojis";
import { BarChart3, Info, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface PollEmojiSettingsProps {
  guildId: string;
  initialPollEmojis: string[];
}

const inputSt = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#F5F4F5",
  borderRadius: 8,
  padding: "10px",
  fontSize: 20,
  outline: "none",
  textAlign: "center" as const,
  width: "100%",
  fontFamily: "inherit",
};

export function PollEmojiSettings({ guildId, initialPollEmojis }: PollEmojiSettingsProps) {
  const [pollEmojis, setPollEmojis] = useState<string[]>(initialPollEmojis);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    const result = await updateCustomEmojis(guildId, { customPollEmojis: pollEmojis });
    setSaving(false);
    if (result.success) {
      showToast('Poll emojis updated');
    } else {
      showToast(result.error || 'Failed to update', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "#A8A9A2" }}>
        Customize the reaction emojis used for poll options (4 emojis required).
      </p>

      {/* Emoji grid */}
      <div className="grid grid-cols-4 gap-3">
        {pollEmojis.map((emoji, index) => (
          <div key={index}>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#A8A9A2" }}>
              Option {index + 1}
            </label>
            <input
              type="text"
              value={emoji}
              onChange={e => {
                const next = [...pollEmojis];
                next[index] = e.target.value;
                setPollEmojis(next);
              }}
              placeholder="🔢"
              maxLength={10}
              style={inputSt}
            />
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 rounded-xl text-xs" style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}>
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1FA7BB" }} />
        <div>
          <p className="font-semibold mb-1" style={{ color: "#1FA7BB" }}>Custom server emojis:</p>
          <p style={{ color: "#A8A9A2" }}>
            Type <code className="px-1 rounded" style={{ background: "rgba(31,167,187,0.12)", color: "#1FA7BB" }}>\:emoji_name:</code> in Discord to get the ID, then paste it here.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setPollEmojis(["1️⃣", "2️⃣", "3️⃣", "4️⃣"])}
          className="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/5"
          style={{ color: "#A8A9A2", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
