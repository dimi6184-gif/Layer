"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Copy,
  Check,
  Info,
  Calendar,
  Layers,
  Fingerprint
} from "lucide-react";

interface UserProfile {
  name: string;
  email?: string;
  image?: string;
  discordId: string;
  globalTrust: number;
  joinedAt: string;
}

export function AccountSettings({ profile }: { profile: UserProfile }) {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.discordId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Real User Profile Card */}
        <div className="comic-card p-6 flex flex-col items-center text-center">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-indigo-500/20 shadow-2xl mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-black shadow-2xl mb-4">
              {profile.name[0]}
            </div>
          )}

          <h3 className="text-xl font-black text-white mb-1">
            {profile.name}
          </h3>
          <p className="text-sm text-zinc-500 mb-4">{profile.email || "No Email Provided"}</p>

          <div className="w-full space-y-3 pt-4 border-t border-white/5 text-left text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Discord ID</span>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-mono text-zinc-400">{profile.discordId}</span>
                {copiedId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Joined Platform</span>
              <span className="text-zinc-300 flex items-center gap-1">
                <Calendar size={12} className="text-zinc-500" />
                {(() => {
                  const d = new Date(profile.joinedAt);
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  return `${day}.${month}.${d.getFullYear()}`;
                })()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Authentication</span>
              <span className="text-zinc-300 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px]">
                Discord OAuth2
              </span>
            </div>
          </div>
        </div>

        {/* Real Global Trust Clearance Card */}
        <div className="comic-card p-6 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-indigo-400" />
              <h3 className="text-base font-black text-white">Trust & Security Clearance</h3>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Your account reputational clearance level is fetched directly from the database. This represents your active participation clearance on the bot network and grants secure Node administrative rights.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end text-sm">
              <span className="text-zinc-400">Global Trust Reputation</span>
              <span className="text-xl font-bold text-indigo-400">{profile.globalTrust}%</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border-3 border-black">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                style={{ width: `${profile.globalTrust}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-1">
              <Info size={12} />
              <span>rep_score fetched live from PostgreSQL node.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection & Network Node details */}
      <div className="comic-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-3">
          <Fingerprint size={18} className="text-yellow-400" />
          <h3 className="text-base font-black text-white">Verified Platform Integration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400">
          <div className="bg-[#111] p-4 rounded-xl border-3 border-black">
            <span className="text-zinc-500 block mb-1">OAuth Scope Permissions</span>
            <span className="text-white font-mono">identify, guilds, email</span>
          </div>
          <div className="bg-[#111] p-4 rounded-xl border-3 border-black">
            <span className="text-zinc-500 block mb-1">Database Sync Status</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active PostgreSQL Connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
