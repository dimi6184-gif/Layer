"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Shield, AlertTriangle, Eye, Image, Link as LinkIcon, Save, Check } from "lucide-react";
import { updateAntiScamSettings } from "@/actions/anti-scam";
import { ToggleSwitch } from "./Toggle";

interface AntiScamSettingsProps {
  guildId: string;
  settings: { enabled: boolean; sensitivity: "low" | "medium" | "high" };
}

const sensitivityOptions = {
  low: {
    label: "Low",
    description: "Only detects obvious scams with high confidence",
    activeColor: "#1FA7BB",
    activeBg: "rgba(31,167,187,0.08)",
    activeBorder: "rgba(31,167,187,0.3)",
  },
  medium: {
    label: "Medium",
    description: "Balanced detection � recommended for most servers",
    activeColor: "#F5F4F5",
    activeBg: "rgba(245,244,245,0.08)",
    activeBorder: "rgba(245,244,245,0.2)",
  },
  high: {
    label: "High",
    description: "Strict detection � may have false positives",
    activeColor: "#EF4444",
    activeBg: "rgba(239,68,68,0.08)",
    activeBorder: "rgba(239,68,68,0.3)",
  },
};

export function AntiScamSettings({ guildId, settings: initialSettings }: AntiScamSettingsProps) {
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [sensitivity, setSensitivity] = useState(initialSettings.sensitivity);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await updateAntiScamSettings(guildId, { enabled, sensitivity });
      setSaved(true);
      showToast('Anti-scam settings saved');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}

      {/* Protection Settings Card */}
      <div className="p-5 rounded-2xl space-y-5" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Shield className="w-4 h-4" style={{ color: "#1FA7BB" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Protection Settings</h2>
        </div>

        {/* Enable toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Anti-Scam</p>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Automatically detect and remove scam messages</p>
          </div>
          <ToggleSwitch enabled={enabled} onChange={setEnabled} />
        </div>

        {/* Sensitivity */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#A8A9A2" }}>Detection Sensitivity</label>
          <div className="grid grid-cols-3 gap-3">
            {(["low", "medium", "high"] as const).map((level) => {
              const info = sensitivityOptions[level];
              const isSelected = sensitivity === level;
              return (
                <button
                  key={level}
                  onClick={() => setSensitivity(level)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: isSelected ? info.activeBg : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? info.activeBorder : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: isSelected ? info.activeColor : "#F5F4F5" }}>
                    {info.label}
                  </div>
                  <div className="text-xs" style={{ color: "#A8A9A2" }}>{info.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
            style={{ background: "#1FA7BB", color: "#101012" }}
          >
            {loading ? <Save size={14} className="animate-pulse" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {loading ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
          {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>? Settings saved</span>}
        </div>
      </div>

      {/* Detection Features */}
      <div className="p-5 rounded-2xl" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#F5F4F5" }}>Detection Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: <LinkIcon className="w-4 h-4" />, title: "Link Analysis", desc: "Detects phishing links, fake Discord/Steam/Nitro URLs, and malicious domains" },
            { icon: <Image className="w-4 h-4" />, title: "OCR Image Scanning", desc: "Scans images for scam text using AI-powered OCR technology" },
            { icon: <AlertTriangle className="w-4 h-4" />, title: "Pattern Detection", desc: "Identifies common scam patterns like free Nitro, crypto giveaways, and fake bots" },
            { icon: <Eye className="w-4 h-4" />, title: "Real-time Protection", desc: "Instantly deletes detected scams and warns users with automatic notifications" },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <div className="p-2 rounded-lg flex-shrink-0 h-fit" style={{ background: "rgba(255,255,255,0.06)", color: "#F5F4F5" }}>
                {f.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5" style={{ color: "#F5F4F5" }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#A8A9A2" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div
        className="flex gap-3 p-4 rounded-2xl"
        style={{ background: "rgba(31,167,187,0.06)", border: "1px solid rgba(31,167,187,0.15)" }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1FA7BB" }} />
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "#1FA7BB" }}>How it works:</p>
          <ul className="space-y-1 text-xs" style={{ color: "#A8A9A2" }}>
            <li>� Messages are analyzed in real-time for scam patterns</li>
            <li>� Detected scams are automatically deleted</li>
            <li>� Users receive a warning message with detection details</li>
            <li>� All detections are logged to your configured log channel</li>
            <li>� AI token usage is tracked for image analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
