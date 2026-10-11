"use client";

import { useState } from "react";
import { updateCustomEmojis } from "@/actions/custom-emojis";
import { Smile, Gift, BarChart3, Info } from "lucide-react";

interface CustomEmojisSettingsProps {
  guildId: string;
  initialPollEmojis: string[];
  initialGiveawayEmoji: string;
}

export function CustomEmojisSettings({
  guildId,
  initialPollEmojis,
  initialGiveawayEmoji,
}: CustomEmojisSettingsProps) {
  const [pollEmojis, setPollEmojis] = useState<string[]>(initialPollEmojis);
  const [giveawayEmoji, setGiveawayEmoji] = useState(initialGiveawayEmoji);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const result = await updateCustomEmojis(guildId, {
      customPollEmojis: pollEmojis,
      customGiveawayEmoji: giveawayEmoji,
    });

    setSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: "Custom emojis updated successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update" });
    }

    setTimeout(() => setMessage(null), 5000);
  };

  const handleReset = () => {
    setPollEmojis(["1️⃣", "2️⃣", "3️⃣", "4️⃣"]);
    setGiveawayEmoji("🎉");
  };

  return (
    <div className="space-y-6">
      {/* Poll Emojis */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-black">Poll Reaction Emojis</h3>
            <p className="text-sm text-zinc-400">
              Customize the emojis used for poll reactions (4 emojis required)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {pollEmojis.map((emoji, index) => (
            <div key={index}>
              <label className="block text-sm font-bold text-zinc-300 mb-2">
                Option {index + 1}
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => {
                  const newEmojis = [...pollEmojis];
                  newEmojis[index] = e.target.value;
                  setPollEmojis(newEmojis);
                }}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-center text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                placeholder="🔢"
                maxLength={10}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-bold mb-1">How to use custom server emojis:</p>
            <p className="text-blue-400/80">
              Copy the emoji ID from Discord (type <code className="bg-blue-500/20 px-1.5 py-0.5 rounded">\:emoji_name:</code> in chat) and paste it here.
              For example: <code className="bg-blue-500/20 px-1.5 py-0.5 rounded">&lt;:custom:1234567890&gt;</code>
            </p>
          </div>
        </div>
      </div>

      {/* Giveaway Emoji */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Gift className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-black">Giveaway Button Emoji</h3>
            <p className="text-sm text-zinc-400">
              Customize the emoji used for the giveaway entry button
            </p>
          </div>
        </div>

        <div className="max-w-xs">
          <input
            type="text"
            value={giveawayEmoji}
            onChange={(e) => setGiveawayEmoji(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-white text-center text-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
            placeholder="🎉"
            maxLength={10}
          />
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
          <Smile className="w-4 h-4" />
          <span>Preview: <span className="text-2xl ml-2">{giveawayEmoji || "🎉"}</span></span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg border border-zinc-700/50 transition-all"
        >
          Reset to Defaults
        </button>

        <div className="flex items-center gap-4">
          {message && (
            <div
              className={`text-sm font-bold ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg shadow-yellow-500/25"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
