"use client";

import { useState, useTransition } from "react";
import { updateAIPersonality } from "@/actions/modules";
import { Bot, Save, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export function AIPersonalityForm({ discordId, initialPersonality }: { discordId: string; initialPersonality: string | null }) {
  const [personality, setPersonality] = useState(initialPersonality || "");
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleSave = () => {
    startTransition(() => {
      updateAIPersonality(discordId, personality).then(() => {
        showToast('Bot personality saved');
      }).catch(() => {
        showToast('Failed to save personality', 'error');
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Bot className="w-4 h-4" style={{ color: "#1FA7BB" }} />
        <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Bot Personality</h3>
      </div>

      <p className="text-xs" style={{ color: "#A8A9A2" }}>
        Describe how the AI should behave. Give it a name, a tone (e.g. sarcastic, helpful, professional), and background knowledge about your server.
      </p>

      <textarea
        value={personality}
        onChange={(e) => setPersonality(e.target.value)}
        placeholder="You are Layer, a helpful and friendly moderator bot..."
        rows={6}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "12px 14px",
          color: "#F5F4F5",
          fontSize: 13,
          outline: "none",
          resize: "vertical",
          fontFamily: "inherit",
        }}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          {isPending ? <Save size={14} className="animate-pulse" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {isPending ? "Saving..." : saved ? "Saved!" : "Save Personality"}
        </button>
        {saved && (
          <span className="text-xs font-medium" style={{ color: "#22C55E" }}>
            ? Successfully saved
          </span>
        )}
      </div>
    </div>
  );
}
