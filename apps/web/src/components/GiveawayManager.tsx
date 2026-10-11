'use client';

import { useState } from 'react';
import { Gift, Plus, X, Trophy, Clock, Users, Trash2, RotateCcw, CheckCircle2, Save } from 'lucide-react';
import { createGiveaway, endGiveaway, rerollGiveaway, deleteGiveaway } from '@/actions/giveaways';
import { ToggleSwitch } from './Toggle';
import { useToast } from '@/context/ToastContext';

interface Channel { id: string; name: string; type: number }
interface Role { id: string; name: string; color: number }
interface Giveaway {
  id: string; messageId: string | null; channelId: string; prize: string;
  description: string | null; winnerCount: number; participants: string[];
  winnerIds: string[]; winnerNames: string[]; endsAt: Date; ended: boolean;
  requiredRoleIds: string[]; requiredLevel: number | null; requireBoost: boolean;
  blacklistedRoleIds: string[]; hostName: string; createdAt: Date;
}

interface GiveawayManagerProps {
  guildId: string;
  activeGiveaways: Giveaway[];
  endedGiveaways: Giveaway[];
  channels: Channel[];
  roles: Role[];
}

const cardStyle = { background: "#121315", border: "1px solid rgba(255,255,255,0.06)" };
const inputSt = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F5F4F5", fontSize: 13, outline: "none", fontFamily: "inherit",
};
const labelSt = { color: "#A8A9A2", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 4 };

export function GiveawayManager({ guildId, activeGiveaways: initialActive, endedGiveaways: initialEnded, channels, roles }: GiveawayManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [prize, setPrize] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1');
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [winnerCount, setWinnerCount] = useState(1);
  const [channelId, setChannelId] = useState('');
  const [requiredLevel, setRequiredLevel] = useState('');
  const [requireBoost, setRequireBoost] = useState(false);

  const resetForm = () => {
    setPrize(''); setDescription(''); setDuration('1'); setDurationUnit('hours');
    setWinnerCount(1); setChannelId(''); setRequiredLevel(''); setRequireBoost(false);
  };

  const handleCreate = async () => {
    if (!prize || !channelId) return showToast('Prize and channel are required', 'error');
    setLoading(true);
    try {
      const durationMap = { minutes: 60, hours: 3600, days: 86400 };
      await createGiveaway(guildId, {
        prize, description: description || undefined,
        duration: parseInt(duration) * durationMap[durationUnit],
        winnerCount, channelId,
        requiredLevel: requiredLevel ? parseInt(requiredLevel) : undefined,
        requireBoost,
      });
      showToast('Giveaway created!');
      setShowCreateForm(false);
      resetForm();
      setTimeout(() => window.location.reload(), 800);
    } catch (err: any) {
      showToast(err.message || 'Failed to create giveaway', 'error');
    } finally { setLoading(false); }
  };

  const handleEnd = async (messageId: string) => {
    if (!confirm('End this giveaway now?')) return;
    setLoading(true);
    try {
      await endGiveaway(guildId, messageId);
      showToast('Giveaway ended');
      setTimeout(() => window.location.reload(), 800);
    } catch (err: any) {
      showToast(err.message || 'Failed to end giveaway', 'error');
    } finally { setLoading(false); }
  };

  const handleReroll = async (messageId: string) => {
    const count = prompt('How many winners to reroll?', '1');
    if (!count) return;
    setLoading(true);
    try {
      await rerollGiveaway(guildId, messageId, parseInt(count));
      showToast(`Rerolled ${count} winner(s)`);
      setTimeout(() => window.location.reload(), 800);
    } catch (err: any) {
      showToast(err.message || 'Failed to reroll', 'error');
    } finally { setLoading(false); }
  };

  const handleDelete = async (giveawayId: string) => {
    if (!confirm('Delete this giveaway? This cannot be undone.')) return;
    setLoading(true);
    try {
      await deleteGiveaway(guildId, giveawayId);
      showToast('Giveaway deleted', 'info');
      setTimeout(() => window.location.reload(), 800);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally { setLoading(false); }
  };

  const formatTimeLeft = (endsAt: Date) => {
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="space-y-4">

      {/* Create button / form */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: "#1FA7BB", color: "#101012" }}
        >
          <Plus className="w-4 h-4" /> Create New Giveaway
        </button>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          {/* Form header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" style={{ color: "#1FA7BB" }} />
              <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Create Giveaway</h2>
            </div>
            <button onClick={() => setShowCreateForm(false)} style={{ color: "#A8A9A2" }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label style={labelSt}>Prize *</label>
              <input type="text" value={prize} onChange={e => setPrize(e.target.value)} placeholder="What are you giving away?" style={inputSt} />
            </div>

            <div>
              <label style={labelSt}>Description (Optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Additional details..." rows={2} style={{ ...inputSt, resize: "vertical" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelSt}>Duration *</label>
                <div className="flex gap-2">
                  <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" style={{ ...inputSt, width: 70, flex: "none" }} />
                  <select value={durationUnit} onChange={e => setDurationUnit(e.target.value as any)} style={{ ...inputSt, cursor: "pointer" }}>
                    <option value="minutes" style={{ background: "#121315" }}>Minutes</option>
                    <option value="hours" style={{ background: "#121315" }}>Hours</option>
                    <option value="days" style={{ background: "#121315" }}>Days</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelSt}>Winners *</label>
                <input type="number" value={winnerCount} onChange={e => setWinnerCount(parseInt(e.target.value) || 1)} min="1" max="20" style={inputSt} />
              </div>
            </div>

            <div>
              <label style={labelSt}>Channel *</label>
              <select value={channelId} onChange={e => setChannelId(e.target.value)} style={{ ...inputSt, cursor: "pointer" }}>
                <option value="" style={{ background: "#121315" }}>Select a channel...</option>
                {channels.map(ch => <option key={ch.id} value={ch.id} style={{ background: "#121315" }}># {ch.name}</option>)}
              </select>
            </div>

            {/* Requirements */}
            <div className="pt-3 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={labelSt}>Requirements (Optional)</p>
              <div>
                <label style={{ ...labelSt, marginBottom: 4 }}>Minimum Level</label>
                <input type="number" value={requiredLevel} onChange={e => setRequiredLevel(e.target.value)} placeholder="No requirement" min="1" style={inputSt} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#F5F4F5" }}>Require Server Boost</span>
                <ToggleSwitch enabled={requireBoost} onChange={setRequireBoost} />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={handleCreate} disabled={loading || !prize || !channelId}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:opacity-90"
                style={{ background: "#1FA7BB", color: "#101012" }}>
                <Gift className="w-4 h-4" />
                {loading ? 'Creating...' : 'Create Giveaway'}
              </button>
              <button onClick={() => setShowCreateForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ color: "#A8A9A2", border: "1px solid rgba(255,255,255,0.08)" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Giveaways */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" style={{ color: "#1FA7BB" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>
            Active Giveaways <span className="ml-1 px-1.5 py-0.5 rounded-md text-xs" style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}>{initialActive.length}</span>
          </h2>
        </div>

        {initialActive.length === 0 ? (
          <div className="py-8 text-center rounded-2xl text-sm" style={{ ...cardStyle, color: "#A8A9A2" }}>
            No active giveaways
          </div>
        ) : (
          <div className="space-y-3">
            {initialActive.map(g => (
              <div key={g.id} className="p-5 rounded-2xl" style={cardStyle}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-1 truncate" style={{ color: "#F5F4F5" }}>{g.prize}</h3>
                    {g.description && <p className="text-xs mb-2" style={{ color: "#A8A9A2" }}>{g.description}</p>}
                    <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#A8A9A2" }}>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{g.winnerCount} winner{g.winnerCount > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{g.participants.length} entries</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTimeLeft(g.endsAt)}</span>
                    </div>
                    {(g.requiredLevel || g.requireBoost || g.requiredRoleIds.length > 0) && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {g.requiredLevel && <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}>Level {g.requiredLevel}+</span>}
                        {g.requireBoost && <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(236,72,153,0.1)", color: "#ec4899" }}>Boost Required</span>}
                      </div>
                    )}
                  </div>
                  {g.messageId && (
                    <button onClick={() => handleEnd(g.messageId!)} disabled={loading}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex-shrink-0"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                      End Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ended Giveaways */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4" style={{ color: "#A8A9A2" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>
            Ended Giveaways <span className="ml-1 px-1.5 py-0.5 rounded-md text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "#A8A9A2" }}>{initialEnded.length}</span>
          </h2>
        </div>

        {initialEnded.length === 0 ? (
          <div className="py-8 text-center rounded-2xl text-sm" style={{ ...cardStyle, color: "#A8A9A2" }}>
            No ended giveaways
          </div>
        ) : (
          <div className="space-y-2">
            {initialEnded.map(g => (
              <div key={g.id} className="p-4 rounded-2xl" style={{ ...cardStyle, opacity: 0.75 }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate" style={{ color: "#F5F4F5" }}>{g.prize}</h3>
                    <div className="flex flex-wrap gap-3 text-xs mt-1" style={{ color: "#A8A9A2" }}>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{g.winnerIds.length} winner{g.winnerIds.length > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{g.participants.length} entries</span>
                    </div>
                    {g.winnerNames.length > 0 && (
                      <p className="text-xs mt-1" style={{ color: "#22C55E" }}>Winners: {g.winnerNames.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {g.messageId && (
                      <button onClick={() => handleReroll(g.messageId!)} disabled={loading}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                        style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB", border: "1px solid rgba(31,167,187,0.2)" }}>
                        <RotateCcw className="w-3 h-3" /> Reroll
                      </button>
                    )}
                    <button onClick={() => handleDelete(g.id)} disabled={loading}
                      className="p-1.5 rounded-lg transition-all disabled:opacity-50"
                      style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
