"use client";

import { useState } from "react";
import { updateCustomEmojis } from "@/actions/custom-emojis";
import { Smile, Gift, Info, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface GiveawayEmojiSettingsProps {
  guildId: string;
  initialGiveawayEmoji: string;
}

const labelStyle = { color: "#A8A9A2", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" };
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#F5F4F5",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};

export function GiveawayEmojiSettings({ guildId, initialGiveawayEmoji }: GiveawayEmojiSettingsProps) {
  const [giveawayEmoji, setGiveawayEmoji] = useState(initialGiveawayEmoji);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    const result = await updateCustomEmojis(guildId, { customGiveawayEmoji: giveawayEmoji });
    setSaving(false);
    if (result.success) {
      showToast('Giveaway emoji updated');
    } else {
      showToast(result.error || 'Failed to update', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Gift className="w-4 h-4" style={{ color: "#1FA7BB" }} />
        <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Giveaway Button Emoji</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        <div>
          <label style={labelStyle} className="block mb-1.5">Emoji</label>
          <input
            type="text"
            value={giveawayEmoji}
            onChange={(e) => setGiveawayEmoji(e.target.value)}
            placeholder="🎉"
            maxLength={10}
            style={{ ...inputStyle, textAlign: "center", fontSize: 20 }}
          />
          <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "#A8A9A2" }}>
            <Smile className="w-3 h-3" />
            <span>Preview: <span className="text-lg ml-1">{giveawayEmoji || "🎉"}</span></span>
          </div>
        </div>

        <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}>
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1FA7BB" }} />
            <div>
              <p className="font-semibold mb-1" style={{ color: "#1FA7BB" }}>Custom server emojis:</p>
              <p style={{ color: "#A8A9A2" }}>
                Type <code className="px-1 rounded" style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}>\:emoji_name:</code> in Discord to get the ID.
                E.g. <code className="px-1 rounded" style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}>&lt;:custom:1234&gt;</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setGiveawayEmoji("🎉")}
          className="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/5"
          style={{ color: "#A8A9A2", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Reset to Default
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
