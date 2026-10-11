"use client";

import { useState } from "react";
import { updateMusicSettings } from "@/actions/modules";
import { useToast } from "@/context/ToastContext";
import { Music, Plus, Trash2, Check, Save, Loader2 } from "lucide-react";
import { CustomSelect } from "./CustomSelect";

interface MusicConfigProps {
  discordId: string;
  initialDjRoleIds: string[];
  serverRoles: { id: string; name: string; color: number }[];
}

export function MusicConfig({ discordId, initialDjRoleIds, serverRoles }: MusicConfigProps) {
  const [djRoleIds, setDjRoleIds] = useState<string[]>(initialDjRoleIds || []);
  const [newRoleId, setNewRoleId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMusicSettings(discordId, djRoleIds);
      setSaved(true);
      showToast('Music configuration saved');
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const addRole = () => {
    if (!newRoleId || djRoleIds.includes(newRoleId.trim())) return;
    setDjRoleIds([...djRoleIds, newRoleId.trim()]);
    setNewRoleId("");
  };

  const removeRole = (id: string) => setDjRoleIds(djRoleIds.filter(r => r !== id));

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wider pb-3" style={{ color: "#A8A9A2", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        DJ Roles
      </p>

      <p className="text-xs" style={{ color: "#A8A9A2" }}>
        Users must have at least one of these roles to use music commands. Leave empty to allow everyone.
      </p>

      {/* Current DJ roles */}
      <div className="flex flex-wrap gap-2">
        {djRoleIds.length === 0 ? (
          <span className="text-xs italic" style={{ color: "#A8A9A2" }}>No DJ Roles set � everyone can play music</span>
        ) : djRoleIds.map((id) => {
          const roleName = serverRoles.find(r => r.id === id)?.name || id;
          return (
            <div
              key={id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(31,167,187,0.1)", border: "1px solid rgba(31,167,187,0.2)", color: "#1FA7BB" }}
            >
              @{roleName}
              <button onClick={() => removeRole(id)} className="transition-colors hover:opacity-70">
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add role */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <CustomSelect
            value={newRoleId}
            onChange={setNewRoleId}
            options={serverRoles.filter(r => r.name !== "@everyone")}
            placeholder="Select a Discord Role..."
          />
        </div>
        <button
          onClick={addRole}
          disabled={!newRoleId}
          className="p-2.5 rounded-xl transition-all disabled:opacity-40 hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          <Plus size={16} />
        </button>
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
        {saved && <span className="text-xs font-medium" style={{ color: "#22C55E" }}>? Configuration saved</span>}
      </div>
    </div>
  );
}
