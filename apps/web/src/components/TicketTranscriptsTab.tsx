"use client";

import { useState } from "react";
import { MessageSquare, Settings2 } from "lucide-react";
import { TicketTranscriptViewer } from "./TicketTranscriptViewer";
import { TicketTranscriptSettings } from "./TicketTranscriptSettings";

interface TicketTranscriptsTabProps {
  discordId: string;
  initialEnabled: boolean;
  initialChannelId: string | null;
  channels: { id: string; name: string }[];
}

export function TicketTranscriptsTab({
  discordId,
  initialEnabled,
  initialChannelId,
  channels,
}: TicketTranscriptsTabProps) {
  const [subTab, setSubTab] = useState<"viewer" | "settings">("viewer");

  return (
    <div className="space-y-4">
      {/* Sub-navigation pill switcher */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
          <button
            onClick={() => setSubTab("viewer")}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: subTab === "viewer" ? "rgba(31,167,187,0.15)" : "transparent",
              color: subTab === "viewer" ? "#1FA7BB" : "#A8A9A2",
            }}
          >
            <MessageSquare size={13} />
            Chat Viewer & Archive
          </button>
          <button
            onClick={() => setSubTab("settings")}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: subTab === "settings" ? "rgba(31,167,187,0.15)" : "transparent",
              color: subTab === "settings" ? "#1FA7BB" : "#A8A9A2",
            }}
          >
            <Settings2 size={13} />
            Export Settings
          </button>
        </div>
      </div>

      {/* Sub-tab view */}
      {subTab === "viewer" ? (
        <TicketTranscriptViewer discordId={discordId} />
      ) : (
        <TicketTranscriptSettings
          discordId={discordId}
          initialEnabled={initialEnabled}
          initialChannelId={initialChannelId}
          channels={channels}
        />
      )}
    </div>
  );
}
