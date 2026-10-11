"use client";

import { useState } from "react";
import { Palette, Bot, FileText } from "lucide-react";
import { TicketConfig } from "./TicketConfig";
import { AITicketModeratorSettings } from "./AITicketModeratorSettings";
import { TicketTranscriptsTab } from "./TicketTranscriptsTab";

interface GuildTicketData {
  ticketCategoryId: string | null;
  ticketSupportRoleIds: string[];
  ticketPanelTitle: string;
  ticketPanelDescription: string;
  ticketPanelColor: string;
  ticketButtonLabel: string;
  ticketButtonEmoji: string;
  ticketUseDropdown: boolean;
  ticketReasons: unknown;
  ticketTranscriptEnabled: boolean;
  ticketTranscriptChannelId: string | null;
  aiTicketModeratorEnabled: boolean;
  aiTicketStaffRoleIds: string[];
  aiTicketPersonality: string | null;
  aiTicketMaxMessages: number;
  aiTicketAutoDelay: number;
  aiTicketEscalateAfter: number;
  aiTicketConfidenceMin: number;
  aiTicketEscalateRoleIds: string[];
  aiTicketKnowledgeBase: unknown;
  aiTicketBlacklist: string[];
  aiTicketWhitelist: string[];
  aiTicketLanguage: string;
}

interface TicketPageTabsProps {
  discordId: string;
  guild: GuildTicketData;
  categories: { id: string; name: string }[];
  roles: { id: string; name: string; color: number }[];
  textChannels: { id: string; name: string }[];
}

const tabs = [
  { id: "panel", label: "Panel", icon: Palette },
  { id: "ai", label: "AI Moderator", icon: Bot },
  { id: "transcripts", label: "Transcripts", icon: FileText },
];

export function TicketPageTabs({ discordId, guild, categories, roles, textChannels }: TicketPageTabsProps) {
  const [activeTab, setActiveTab] = useState("panel");

  const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="rounded-2xl overflow-hidden" style={cardStyle}>
      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all relative"
              style={{
                color: isActive ? "#F5F4F5" : "#A8A9A2",
                borderBottom: isActive ? "2px solid #1FA7BB" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? "#1FA7BB" : "#A8A9A2" }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === "panel" && (
          <TicketConfig
            discordId={discordId}
            initialCategoryId={guild.ticketCategoryId}
            initialSupportRoleIds={guild.ticketSupportRoleIds}
            initialPanelTitle={guild.ticketPanelTitle}
            initialPanelDescription={guild.ticketPanelDescription}
            initialPanelColor={guild.ticketPanelColor}
            initialButtonLabel={guild.ticketButtonLabel}
            initialButtonEmoji={guild.ticketButtonEmoji}
            initialUseDropdown={guild.ticketUseDropdown}
            initialReasons={guild.ticketReasons as Parameters<typeof TicketConfig>[0]["initialReasons"]}
            categories={categories}
            serverRoles={roles}
          />
        )}

        {activeTab === "ai" && (
          <AITicketModeratorSettings
            discordId={discordId}
            initialEnabled={guild.aiTicketModeratorEnabled}
            initialStaffRoleIds={guild.aiTicketStaffRoleIds}
            initialPersonality={guild.aiTicketPersonality}
            initialMaxMessages={guild.aiTicketMaxMessages}
            initialAutoDelay={guild.aiTicketAutoDelay}
            initialEscalateAfter={guild.aiTicketEscalateAfter}
            initialConfidenceMin={guild.aiTicketConfidenceMin}
            initialEscalateRoleIds={guild.aiTicketEscalateRoleIds}
            initialKnowledgeBase={guild.aiTicketKnowledgeBase}
            initialBlacklist={guild.aiTicketBlacklist}
            initialWhitelist={guild.aiTicketWhitelist}
            initialLanguage={guild.aiTicketLanguage}
            serverRoles={roles}
          />
        )}

        {activeTab === "transcripts" && (
          <TicketTranscriptsTab
            discordId={discordId}
            initialEnabled={guild.ticketTranscriptEnabled}
            initialChannelId={guild.ticketTranscriptChannelId}
            channels={textChannels}
          />
        )}
      </div>
    </div>
  );
}
