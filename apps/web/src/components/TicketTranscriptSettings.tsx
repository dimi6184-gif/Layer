"use client";

import { useState, useTransition } from "react";
import { FileText, Check } from "lucide-react";
import { updateTicketTranscriptSettings } from "@/actions/tickets";
import { toast } from "sonner";

interface TicketTranscriptSettingsProps {
  discordId: string;
  initialEnabled: boolean;
  initialChannelId: string | null;
  channels: { id: string; name: string }[];
}

export function TicketTranscriptSettings({
  discordId,
  initialEnabled,
  initialChannelId,
  channels,
}: TicketTranscriptSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [channelId, setChannelId] = useState(initialChannelId || "");

  const handleSave = async () => {
    if (enabled && !channelId) {
      toast.error("Please select a channel for transcripts");
      return;
    }

    startTransition(async () => {
      try {
        await updateTicketTranscriptSettings(discordId, {
          enabled,
          channelId,
        });
        toast.success("Transcript settings saved!");
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to save settings");
      }
    });
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#F5F4F5",
  };
  const labelStyle = { color: "#A8A9A2", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="flex items-start gap-3.5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}>
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold" style={{ color: "#F5F4F5" }}>Discord Export Settings</h3>
          <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>
            Automatically compile and export an HTML transcript file directly into a designated staff Discord channel whenever a ticket is closed.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable Toggle */}
        <div
          className="flex items-center justify-between p-4 rounded-xl transition-colors"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Send HTML Transcripts to Channel</p>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>
              Upload an interactive HTML archive file into Discord upon closing.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
            style={{ background: enabled ? "#1FA7BB" : "rgba(255,255,255,0.1)" }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Channel Selection */}
        {enabled && (
          <div className="space-y-1.5 pt-1">
            <label className="block" style={labelStyle}>
              Discord Transcript Channel <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors cursor-pointer"
              style={inputStyle}
            >
              <option value="" style={{ background: "#121315", color: "#A8A9A2" }}>Select a destination channel...</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id} style={{ background: "#121315", color: "#F5F4F5" }}>
                  #{channel.name}
                </option>
              ))}
            </select>
            <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
              The bot needs <code className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.06)", color: "#1FA7BB" }}>Send Messages</code> and <code className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.06)", color: "#1FA7BB" }}>Attach Files</code> permissions in this channel.
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleSave}
            disabled={isPending || (enabled && !channelId)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
            style={{ background: "#1FA7BB", color: "#101012" }}
          >
            <Check size={16} />
            {isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
