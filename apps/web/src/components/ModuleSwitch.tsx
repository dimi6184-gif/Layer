"use client";

import { useState, useTransition } from "react";
import { updateModuleStatus } from "@/actions/modules";
import { useToast } from "@/context/ToastContext";

const MODULE_LABELS: Record<string, string> = {
  aiEnabled: "Layer AI",
  moderationEnabled: "Auto Moderation",
  levelingEnabled: "Leveling",
  musicEnabled: "Music",
  ticketsEnabled: "Ticket System",
  aiImageDetectionEnabled: "AI Image Detection",
};

export function ModuleSwitch({
  discordId,
  module,
  initialEnabled,
}: {
  discordId: string;
  module: 'aiEnabled' | 'moderationEnabled' | 'levelingEnabled' | 'musicEnabled' | 'ticketsEnabled' | 'aiImageDetectionEnabled';
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    startTransition(() => {
      updateModuleStatus(discordId, module as any, newValue)
        .then(() => {
          const label = MODULE_LABELS[module] || module;
          showToast(
            `${label} ${newValue ? 'enabled' : 'disabled'}`,
            newValue ? 'success' : 'info'
          );
        })
        .catch(() => {
          setEnabled(enabled);
          showToast('Failed to update module', 'error');
        });
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      style={{ background: enabled ? "#1FA7BB" : "rgba(255,255,255,0.1)" }}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
