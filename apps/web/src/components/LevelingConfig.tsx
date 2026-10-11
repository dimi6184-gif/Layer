"use client";

import { useState } from "react";
import { updateLevelingSettings } from "@/actions/modules";
import { Zap, Plus, Trash2, Check, Loader2, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { CustomSelect } from "./CustomSelect";

interface LevelingConfigProps {
  discordId: string;
  initialLevelUpChannelId: string | null;
  initialLevelRewards: Record<string, string> | null;
  serverRoles: { id: string; name: string; color: number }[];
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

export function LevelingConfig({ discordId, initialLevelUpChannelId, initialLevelRewards, serverRoles }: LevelingConfigProps) {
  const [channelId, setChannelId] = useState(initialLevelUpChannelId || "");
  const [rewards, setRewards] = useState<Record<string, string>>(initialLevelRewards || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false); // kept for button UI
  const { showToast } = useToast();
  const [newLevel, setNewLevel] = useState("");
  const [newRoleId, setNewRoleId] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateLevelingSettings(discordId, channelId.trim() || null, Object.keys(rewards).length > 0 ? rewards : null);
      showToast('Leveling configuration saved');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const addReward = () => {
    if (!newLevel || !newRoleId) return;
    setRewards((prev) => ({ ...prev, [newLevel]: newRoleId.trim() }));
    setNewLevel("");
    setNewRoleId("");
  };

  const removeReward = (level: string) => {
    const next = { ...rewards };
    delete next[level];
    setRewards(next);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wider pb-3" style={{ color: "#A8A9A2", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        Leveling Configuration
      </p>

      {/* Level-up channel */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#A8A9A2" }}>
          Level-Up Announcement Channel ID
        </label>
        <input
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="e.g. 123456789012345678 (leave blank for no announcements)"
          style={inputStyle}
        />
        <p className="text-xs mt-1.5" style={{ color: "#A8A9A2" }}>
          Leave blank to disable level-up announcements.
        </p>
      </div>

      {/* Role Rewards */}
      <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>Role Rewards</h3>
        <p className="text-xs mb-4" style={{ color: "#A8A9A2" }}>Automatically assign roles when users reach specific levels.</p>

        {/* Existing rewards */}
        {Object.entries(rewards)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([level, roleId]) => {
            const roleName = serverRoles.find(r => r.id === roleId)?.name || roleId;
            return (
              <div
                key={level}
                className="flex items-center gap-3 mb-2 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
                  style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}
                >
                  Level {level}
                </span>
                <span className="text-xs flex-1 font-mono" style={{ color: "#F5F4F5" }}>@{roleName}</span>
                <button
                  onClick={() => removeReward(level)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: "#EF4444" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}

        {/* Add reward */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            placeholder="Level"
            style={{ ...inputStyle, width: 90, flex: "none" }}
          />
          <div className="flex-1">
            <CustomSelect
              value={newRoleId}
              onChange={setNewRoleId}
              options={serverRoles.filter(r => r.name !== "@everyone")}
              placeholder="Select a role..."
            />
          </div>
          <button
            onClick={addReward}
            disabled={!newLevel || !newRoleId}
            className="p-2.5 rounded-xl transition-all disabled:opacity-40 hover:opacity-90"
            style={{ background: "#1FA7BB", color: "#101012" }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Configuration"}
        </button>
        {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>✓ Configuration saved</span>}
      </div>
    </div>
  );
}
