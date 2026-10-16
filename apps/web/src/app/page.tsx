'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Eye,
  Sliders,
  Check,
  ChevronDown,
  Volume2,
  Sparkles,
  Bot,
  ExternalLink,
  MessageSquare,
  Users,
  Lock,
  ArrowRight,
  Activity,
  Layers,
  Radio,
} from 'lucide-react';

/* ─── Discord Gamepad SVG Icon ───────────────────────────────── */
function DiscordIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Interactive Verification Demo State
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');

  // Interactive Switch States (Control Panel)
  const [switches, setSwitches] = useState({
    antiScam: true,
    ocrVision: true,
    antiRaid: true,
    aiTickets: true,
    banEvasion: true,
  });

  const toggleSwitch = (key: keyof typeof switches) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeSystemsCount = Object.values(switches).filter(Boolean).length;

  const handleVerifyClick = () => {
    if (verifyStatus === 'idle') {
      setVerifyStatus('verifying');
      setTimeout(() => setVerifyStatus('verified'), 600);
    } else if (verifyStatus === 'verified') {
      setVerifyStatus('idle');
    }
  };

  const faqs = [
    {
      q: 'Is Layer free to use?',
      a: 'Yes! Layer is free to invite and start protecting your server immediately. Essential protection, OCR anti-scam, leveling, and music are included without required payment.',
    },
    {
      q: 'Will Layer ban legitimate users by accident?',
      a: 'No. Layer uses high-confidence multi-factor validation. If an event is borderline, Layer quarantines or logs the message rather than auto-banning.',
    },
    {
      q: 'Does Layer log member IP addresses or private messages?',
      a: 'Never. Layer is architected with a strict zero-telemetry policy. We do not store member IPs, private chat logs, or user emails. Everything runs in-memory.',
    },
    {
      q: 'How fast is setup?',
      a: 'Under 60 seconds. Simply invite the bot, grant recommended permissions, and Layer runs autonomous protection out-of-the-box with sensible defaults.',
    },
    {
      q: 'Can I customize punishment thresholds?',
      a: 'Yes. From your web dashboard at uselayer.de, you can configure whether Layer deletes the message, warns the user, times them out, or bans them immediately.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#101012] text-[#F5F4F5] font-sans selection:bg-[#1FA7BB] selection:text-[#101012] overflow-x-hidden">
      
      {/* ─── Ambient Brand Radial Glow (Layer Teal) ──────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#1FA7BB]/[0.12] via-[#174F49]/[0.05] to-transparent rounded-full blur-3xl" />
      </div>

      {/* ─── 1. Header / Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#101012]/85 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#1FA7BB]/10 border border-[#1FA7BB]/30 flex items-center justify-center transition-all group-hover:border-[#1FA7BB]/60">
              <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain" priority />
            </div>
            <span className="font-bold text-base tracking-tight text-[#F5F4F5]">Layer</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#A8A9A2]">
            <a href="#features" className="hover:text-[#F5F4F5] transition-colors">Features</a>
            <a href="#control-panel" className="hover:text-[#F5F4F5] transition-colors">Control Panel</a>
            <a href="#how-it-works" className="hover:text-[#F5F4F5] transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-[#F5F4F5] transition-colors">FAQ</a>
            <Link href="/commands" className="hover:text-[#F5F4F5] transition-colors">Commands</Link>
            <Link href="/premium" className="hover:text-[#F5F4F5] transition-colors">Pricing</Link>
          </div>

          {/* CTA Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-[#A8A9A2] hover:text-[#F5F4F5] px-3 py-1.5 transition-colors hidden sm:block"
            >
              Dashboard
            </Link>
            <Link
              href="/invite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#101012] bg-[#1FA7BB] hover:bg-[#26bad0] shadow-[0_2px_14px_rgba(31,167,187,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <DiscordIcon size={15} />
              <span>Invite Layer</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── 2. Hero Section ───────────────────────────────────── */}
      <section className="relative z-10 pt-36 sm:pt-40 pb-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-[#1FA7BB] bg-[#1FA7BB]/10 border border-[#1FA7BB]/25">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>Autonomous Discord Security · Active 24/7</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F5F4F5] leading-[1.08]">
              The bot that <br />
              <span className="text-[#1FA7BB]">protects your server.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#A8A9A2] leading-relaxed max-w-lg">
              Layer automatically stops scam links, scans phishing images with neural OCR, and neutralizes malicious raids in under 14ms before your members can click.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/invite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-[#101012] bg-[#1FA7BB] hover:bg-[#26bad0] shadow-[0_4px_20px_rgba(31,167,187,0.35)] transition-all hover:scale-105 active:scale-95"
              >
                <DiscordIcon size={18} />
                <span>Invite Layer</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-[#F5F4F5] bg-[#121315] hover:bg-[#18191d] border border-white/[0.08] transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#A8A9A2]" />
              </Link>
            </div>

            <div className="pt-2 flex items-center gap-6 text-xs text-[#A8A9A2]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22C55E]" />
                <span>Zero IP Data Logged</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22C55E]" />
                <span>60-Second Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22C55E]" />
                <span>Free Forever Core</span>
              </div>
            </div>
          </div>

          {/* Right Hero Preview (Dense Discord Security Window) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#121315] border border-white/[0.08] p-5 space-y-4 shadow-2xl relative">
              
              {/* Discord Window Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <span className="text-xs font-mono text-[#A8A9A2] ml-2">#security-log</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                  SYSTEM READY
                </span>
              </div>

              {/* Message 1: Attacker */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#16171b] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-full bg-[#24252b] flex items-center justify-center text-xs font-bold text-[#A8A49C]">
                  SP
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F5F4F5]">SpamBot#4819</span>
                    <span className="text-[10px] text-neutral-500">13:42</span>
                  </div>
                  <div className="text-xs text-[#EF4444] font-mono bg-[#EF4444]/10 px-2 py-1 rounded inline-block">
                    [REDACTED PHISHING URL]
                  </div>
                </div>
              </div>

              {/* Message 2: Layer Bot Action */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#141519] border border-[#1FA7BB]/30">
                <div className="w-8 h-8 rounded-full bg-[#1FA7BB] flex items-center justify-center text-xs font-bold text-[#101012]">
                  <ShieldCheck className="w-4 h-4 text-[#101012]" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F5F4F5]">Layer</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#5865F2] text-white">BOT</span>
                    <span className="text-[10px] text-neutral-500">Just now</span>
                  </div>
                  <p className="text-xs text-[#A8A9A2] leading-snug">
                    <span className="text-[#22C55E] font-semibold">Threat neutralized in 12ms.</span> Malicious message deleted, user quarantined, and audit log dispatched.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#1FA7BB] pt-1">
                    <span>Target: discord-nitro-drop.ru</span>
                    <span>·</span>
                    <span className="text-[#22C55E]">Safe</span>
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#A8A9A2]">
                <span>Reaction Time: <strong className="text-[#F5F4F5]">12ms</strong></span>
                <span>Audit Stored: <strong className="text-[#F5F4F5]">Memory Only</strong></span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. Metrics Strip (Solid & Compact) ────────────────── */}
      <section className="relative z-10 border-y border-white/[0.06] bg-[#121315]/80 py-6 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#F5F4F5]">18,500+</div>
            <div className="text-xs text-[#A8A9A2] mt-0.5">Members Protected</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1FA7BB]">&lt; 14ms</div>
            <div className="text-xs text-[#A8A9A2] mt-0.5">Average Reaction Speed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#F5F4F5]">100%</div>
            <div className="text-xs text-[#A8A9A2] mt-0.5">Zero Data Logged</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#22C55E]">24/7</div>
            <div className="text-xs text-[#A8A9A2] mt-0.5">Always Online</div>
          </div>
        </div>
      </section>

      {/* ─── 4. DENSE BENTO FEATURE SHOWCASE ───────────────────── */}
      <section id="features" className="relative z-10 py-20 px-6 max-w-6xl mx-auto space-y-6">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1FA7BB]">
              <Shield className="w-3.5 h-3.5" />
              <span>DEFENSE MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#F5F4F5] tracking-tight">
              Every attack vector has an answer.
            </h2>
          </div>
          <p className="text-xs text-[#A8A9A2] max-w-sm sm:text-right">
            Autonomous protection built specifically for fast-moving Discord communities.
          </p>
        </div>

        {/* ─── Bento Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* Row 1 / Card 1 (Wide): Neural OCR Scam Vision */}
          <div className="md:col-span-8 rounded-2xl bg-[#121315] border border-white/[0.08] p-6 sm:p-7 space-y-5 hover:border-[#1FA7BB]/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1FA7BB]">NEURAL OCR VISION</span>
                </div>
                <h3 className="text-xl font-bold text-[#F5F4F5]">Reads text hidden inside scam images.</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1FA7BB]/10 text-[#1FA7BB] border border-[#1FA7BB]/20 hidden sm:inline-block">
                Sub-Millisecond
              </span>
            </div>

            <p className="text-xs text-[#A8A9A2] leading-relaxed max-w-xl">
              Scammers try to bypass bot text filters with fake Nitro promo images and malicious QR codes. Layer’s OCR reads the image contents instantly and wipes the message in 11ms.
            </p>

            {/* Visual Preview Box */}
            <div className="p-4 rounded-xl bg-[#16171b] border border-white/[0.05] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#F5F4F5] font-semibold">nitro-gift-claim.png</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444]">
                    PHISHING DETECTED
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#22C55E]">Auto-Deleted (11ms)</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 bg-[#101012] p-2.5 rounded-lg border border-white/[0.04]">
                OCR Extracted: &quot;https://discord.nitro-claim.ru/gift&quot; ➔ Blacklisted Domain Match
              </div>
            </div>
          </div>

          {/* Row 1 / Card 2: Anti-Raid Shield */}
          <div className="md:col-span-4 rounded-2xl bg-[#121315] border border-white/[0.08] p-6 sm:p-7 space-y-4 hover:border-[#1FA7BB]/30 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-7 h-7 rounded-lg bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F4F5]">Instant Raid Shield</h3>
              <p className="text-xs text-[#A8A9A2] leading-relaxed">
                Detects join spikes (e.g. 40 tokens/sec) and automatically locks suspect joins into quarantine without crashing legitimate chat.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16171b] border border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A8A49C]">Join Velocity Spike</span>
                <span className="text-[#EF4444] font-mono font-bold">42 accounts / 1.2s</span>
              </div>
              <div className="text-[10px] font-mono text-[#22C55E] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Quarantined &amp; Auto-Restored</span>
              </div>
            </div>
          </div>

          {/* Row 2 / Card 3: Zero-IP Verification */}
          <div className="md:col-span-4 rounded-2xl bg-[#121315] border border-white/[0.08] p-6 sm:p-7 space-y-4 hover:border-[#1FA7BB]/30 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F4F5]">Zero-Storage Verification</h3>
              <p className="text-xs text-[#A8A49C] leading-relaxed">
                Stops automated scrapers and alt-accounts with 1-click verification. 0 IP addresses or personal identifiers logged.
              </p>
            </div>

            {/* Interactive Button */}
            <div className="p-3.5 rounded-xl bg-[#16171b] border border-white/[0.05] space-y-2 text-center">
              <button
                type="button"
                onClick={handleVerifyClick}
                disabled={verifyStatus === 'verifying'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  verifyStatus === 'verified'
                    ? 'bg-[#22C55E] text-[#101012]'
                    : 'bg-[#1FA7BB] hover:bg-[#26bad0] text-[#101012] active:scale-95'
                }`}
              >
                {verifyStatus === 'verifying' ? (
                  <span>Verifying in-memory...</span>
                ) : verifyStatus === 'verified' ? (
                  <span>✓ Verified! Role @Member Granted</span>
                ) : (
                  <span>Click to Test Verification</span>
                )}
              </button>
              <div className="text-[10px] text-neutral-500">100% ephemeral · In-memory validation</div>
            </div>
          </div>

          {/* Row 2 / Card 4: Autonomous AI Ticket Co-Pilot */}
          <div className="md:col-span-4 rounded-2xl bg-[#121315] border border-white/[0.08] p-6 sm:p-7 space-y-4 hover:border-[#1FA7BB]/30 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-7 h-7 rounded-lg bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F4F5]">Autonomous AI Tickets</h3>
              <p className="text-xs text-[#A8A49C] leading-relaxed">
                Layer resolves boost syncs, role queries, and FAQ tickets in 2.8 seconds so your moderation team can sleep.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16171b] border border-white/[0.05] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-[#A8A49C]">
                <span>Ticket #0418: Role Boost</span>
                <span className="text-[#22C55E] font-mono">RESOLVED</span>
              </div>
              <p className="text-[11px] text-[#F5F4F5]">
                &quot;Synced @Booster role automatically. Have a great day!&quot;
              </p>
              <div className="text-[10px] text-neutral-500">Resolved in 2.8s · 0 human staff pings</div>
            </div>
          </div>

          {/* Row 2 / Card 5: Lossless Music & Leveling XP */}
          <div className="md:col-span-4 rounded-2xl bg-[#121315] border border-white/[0.08] p-6 sm:p-7 space-y-4 hover:border-[#1FA7BB]/30 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-7 h-7 rounded-lg bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F4F5]">Music &amp; Member XP</h3>
              <p className="text-xs text-[#A8A49C] leading-relaxed">
                High-bitrate 320kbps voice streaming without lag, plus automatic rank cards and role rewards for active chatters.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16171b] border border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F5F4F5] font-semibold">Sarah · Level 38</span>
                <span className="text-[11px] font-mono text-[#1FA7BB]">8,450 / 10k XP</span>
              </div>
              <div className="h-1.5 w-full bg-[#101012] rounded-full overflow-hidden">
                <div className="h-full bg-[#1FA7BB] rounded-full" style={{ width: '84.5%' }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 5. INTERACTIVE CONTROL CENTER (Protector Style) ─────── */}
      <section id="control-panel" className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="rounded-2xl bg-[#121315] border border-white/[0.08] p-6 sm:p-10 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1FA7BB]">
                <Sliders className="w-3.5 h-3.5" />
                <span>CENTRALIZED DASHBOARD</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F4F5] tracking-tight">
                Control your protections from the browser.
              </h2>

              <p className="text-xs sm:text-sm text-[#A8A49C] leading-relaxed">
                Toggle shields, configure auto-moderation rules, set OCR confidence thresholds, and manage your server right from your Layer dashboard.
              </p>

              <div className="p-3.5 rounded-xl bg-[#16171b] border border-white/[0.05] space-y-1">
                <div className="text-xs font-bold text-[#F5F4F5]">Active Defense Matrix</div>
                <div className="text-[11px] text-[#22C55E] font-mono">
                  {activeSystemsCount} of 5 systems online · 0 vulnerabilities detected
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-[#101012] bg-[#1FA7BB] hover:bg-[#26bad0] transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Open Web Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Toggle List */}
            <div className="lg:col-span-7 space-y-2.5">
              {[
                {
                  key: 'antiScam' as const,
                  label: 'Neural OCR Image Scanner',
                  desc: 'Detects text baked into fake Nitro images & QR codes',
                },
                {
                  key: 'antiRaid' as const,
                  label: 'Automated Raid & Velocity Shield',
                  desc: 'Instant quarantine for mass account token floods',
                },
                {
                  key: 'ocrVision' as const,
                  label: 'Zero-Storage Web Verification',
                  desc: '1-click captcha gate with zero IP or telemetry logging',
                },
                {
                  key: 'aiTickets' as const,
                  label: 'Autonomous AI Ticket Co-Pilot',
                  desc: 'Instant answers for member queries & automated role perks',
                },
                {
                  key: 'banEvasion' as const,
                  label: 'Ban Evasion Pattern Detection',
                  desc: 'Flags returning troublemakers before they can re-offend',
                },
              ].map((item) => {
                const isActive = switches[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleSwitch(item.key)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#16171b] border border-white/[0.05] hover:border-[#1FA7BB]/30 cursor-pointer transition-all"
                  >
                    <div className="space-y-0.5 pr-4">
                      <div className="text-xs font-bold text-[#F5F4F5]">{item.label}</div>
                      <div className="text-[11px] text-[#A8A9A2]">{item.desc}</div>
                    </div>

                    {/* Smooth Toggle */}
                    <div
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                        isActive ? 'bg-[#1FA7BB]' : 'bg-[#25272e]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-[#101012] transition-transform duration-200 ${
                          isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ─── 6. HOW IT WORKS (Quick 5-Step Pipeline) ────────────── */}
      <section id="how-it-works" className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#F5F4F5] tracking-tight">
            Protected in under 60 seconds.
          </h2>
          <p className="text-xs text-[#A8A9A2]">
            No complex JSON configs. Just invite and let the autonomous engine work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Invite Layer', desc: 'Add bot with recommended permissions' },
            { step: '02', title: 'Auto-Config', desc: 'Pre-tuned threat filters deploy automatically' },
            { step: '03', title: 'Threat Strikes', desc: 'Phishing image or bot flood attempts entry' },
            { step: '04', title: 'Sub-14ms Intercept', desc: 'Deleted, quarantined, and audited quietly' },
            { step: '05', title: 'Zero Worry', desc: 'Your community stays clean 24/7' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#121315] border border-white/[0.06] space-y-1.5"
            >
              <div className="text-xs font-mono font-bold text-[#1FA7BB]">{item.step}</div>
              <h3 className="text-xs font-bold text-[#F5F4F5]">{item.title}</h3>
              <p className="text-[11px] text-[#A8A9A2] leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. FAQ Section (Accordion) ─────────────────────────── */}
      <section id="faq" className="relative z-10 py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#F5F4F5] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#A8A9A2]">
            Everything you need to know about Layer security and privacy.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#121315] border border-white/[0.06] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#F5F4F5]">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A8A9A2] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#F5F4F5]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#A8A9A2] leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. Bottom CTA Banner (High-Contrast Teal Gradient) ── */}
      <section className="relative z-10 py-14 px-6 max-w-6xl mx-auto">
        <div className="rounded-2xl p-8 sm:p-12 bg-gradient-to-r from-[#174F49] via-[#1FA7BB] to-[#26bad0] text-center space-y-3 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101012] tracking-tight leading-tight">
              Don&apos;t wait for the next raid to secure your server.
            </h2>
            <p className="text-xs sm:text-sm text-[#101012]/80 font-medium leading-relaxed">
              Join thousands of Discord communities already secured by Layer. Free to setup in under 60 seconds.
            </p>
            <div className="pt-1 flex justify-center">
              <Link
                href="/invite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#101012] hover:bg-black shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                <DiscordIcon size={18} />
                <span>Invite Layer to Discord</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Footer (Clean Discord-Bot Style) ─────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#0c0d0f] py-10 px-6 text-xs text-[#A8A9A2]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Layer" width={20} height={20} className="object-contain" />
            <span className="font-bold text-[#F5F4F5]">Layer</span>
            <span className="text-neutral-600">·</span>
            <span>The bot that protects your Discord.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#A8A9A2]">
            <Link href="/terms" className="hover:text-[#F5F4F5] transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#F5F4F5] transition-colors">Privacy Policy</Link>
            <Link href="/refunds" className="hover:text-[#F5F4F5] transition-colors">Refunds</Link>
            <Link href="/commands" className="hover:text-[#F5F4F5] transition-colors">Commands</Link>
            <Link href="/premium" className="hover:text-[#F5F4F5] transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
