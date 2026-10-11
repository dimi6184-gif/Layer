"use client";

import { useState } from "react";
import { updateGeneralSettings } from "@/actions/modules";
import { Save, Check, Loader2, Info, ShieldAlert } from "lucide-react";
import { CustomSelect } from "./CustomSelect";
import { useToast } from "@/context/ToastContext";

interface Channel { id: string; name: string }

interface ServerSettingsProps {
  discordId: string;
  initialLogChannelId: string | null;
  serverChannels: Channel[];
}

export function ServerSettings({ discordId, initialLogChannelId, serverChannels }: ServerSettingsProps) {
  const [logChannelId, setLogChannelId] = useState(initialLogChannelId || "");
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateGeneralSettings(discordId, "!", logChannelId || null, [], false);
      showToast("Server settings saved");
    } catch (e) {
      showToast("Failed to save settings", "error");
      console.error("Failed to save general settings", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Card */}
      <div
        className="p-6 rounded-2xl space-y-5"
        style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Card header */}
        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
            <ShieldAlert size={18} style={{ color: "#F5F4F5" }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Moderation Log Channel</h3>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Configure where moderation events are logged</p>
          </div>
        </div>

        {/* Info box */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}
        >
          <Info size={15} style={{ color: "#1FA7BB", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#1FA7BB" }}>What gets logged here?</p>
            <ul className="space-y-1 text-xs" style={{ color: "#A8A9A2" }}>
              <li>Deleted scam messages (Anti-Scam module)</li>
              <li>Banned word violations (Moderation module)</li>
              <li>User warnings, kicks, and bans</li>
              <li>Anti-spam violations</li>
            </ul>
          </div>
        </div>

        {/* Channel select */}
        <div>
          <label
            className="block text-xs font-semibold mb-2 uppercase tracking-wider"
            style={{ color: "#A8A9A2" }}
          >
            Select Log Channel
          </label>
          <CustomSelect
            value={logChannelId}
            onChange={setLogChannelId}
            options={serverChannels}
            placeholder="Select a channel for moderation logs..."
          />
          <p className="text-xs mt-2" style={{ color: "#A8A9A2" }}>
            Choose a text channel where the bot will send moderation logs. Make sure the bot has permission to send messages there.
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
