'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  Zap,
  Bot,
  Lock,
  Sparkles,
  Terminal,
  ChevronRight,
  Check,
  Music,
  ArrowRight,
  Eye,
  RefreshCw,
  AlertTriangle,
  Cpu,
  Activity,
  Layers,
  ChevronDown,
  Volume2,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

/* ─── Apple Spring Physics ───────────────────────────────────── */
const springTransition = { type: 'spring', stiffness: 350, damping: 30 };
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ─── Navigation ─────────────────────────────────────────────── */
function AppleNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-500 max-w-4xl w-full ${
          scrolled
            ? 'bg-black/75 backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'
        }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-white/[0.08] border border-white/[0.12] transition-transform duration-300 group-hover:scale-105">
            <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain" priority />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            Layer
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            PRO
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
          <a href="#features" className="hover:text-white transition-colors duration-200">
            Features
          </a>
          <a href="#interactive" className="hover:text-white transition-colors duration-200">
            Live Engine
          </a>
          <a href="#security" className="hover:text-white transition-colors duration-200">
            Security
          </a>
          <Link href="/commands" className="hover:text-white transition-colors duration-200">
            Commands
          </Link>
          <Link href="/premium" className="hover:text-white transition-colors duration-200">
            Pricing
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-1.5 transition-colors hidden sm:block"
          >
            Dashboard
          </Link>
          <Link
            href="/invite"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_2px_12px_rgba(34,211,238,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Add to Discord</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ─── Interactive Hero Simulator (Apple-Style Engine Showcase) ── */
function EngineSimulator() {
  const [activeTab, setActiveTab] = useState<'ocr' | 'verify' | 'ai' | 'radar'>('ocr');
  const [scanProgress, setScanProgress] = useState(0);

  // Auto-progress scan beam
  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'ocr', label: 'Vision OCR', icon: Eye, color: 'text-cyan-400' },
    { id: 'verify', label: 'Zero-IP Auth', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'ai', label: 'Neural Support', icon: Bot, color: 'text-purple-400' },
    { id: 'radar', label: 'Alt Radar', icon: Activity, color: 'text-rose-400' },
  ] as const;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-neutral-950/80 border border-white/[0.1] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/40" />
          <span className="ml-3 text-xs font-mono text-neutral-400">layer-kernel-v2.5 // active</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Protected</span>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 p-2 gap-1.5 bg-black/40 border-b border-white/[0.06]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-white/[0.09] text-white shadow-sm border border-white/[0.1]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Screen Display */}
      <div className="p-6 sm:p-8 min-h-[340px] flex items-center justify-center bg-gradient-to-b from-transparent to-black/60 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'ocr' && (
            <motion.div
              key="ocr"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl space-y-4"
            >
              {/* Simulated Discord Message with Phishing Image */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden group">
                <div
                  className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_16px_#22d3ee] pointer-events-none transition-all duration-75"
                  style={{ left: `${scanProgress}%` }}
                />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center text-xs font-bold text-neutral-300">
                    SUS
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-rose-400">SuspiciousSender#9012</span>
                      <span className="text-[10px] text-neutral-500">Today at 12:41 PM</span>
                    </div>
                    <p className="text-xs text-neutral-300">Check this out! Free Nitro gift card giveaway:</p>
                    <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-neutral-200">nitro-gift-claim.png</div>
                        <div className="text-[10px] font-mono text-neutral-400">OCR Target: &quot;discord.nitro-drop.ru&quot;</div>
                      </div>
                      <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                        PHISHING DETECTED
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Bot Action Result */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Threat quarantined & message incinerated automatically</span>
                </div>
                <span className="font-mono text-[11px] opacity-80">14ms response</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl space-y-4"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_24px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Cryptographic Verification</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                    Users verify directly inside Discord with one touch. Zero IP harvesting, zero external browser redirects, zero data retention.
                  </p>
                </div>
                <div className="pt-2 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Verify with Layer</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-sm font-bold text-white font-mono">0 Bytes</div>
                  <div className="text-[10px] text-neutral-400">IPs or Logs Kept</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-sm font-bold text-emerald-400 font-mono">100%</div>
                  <div className="text-[10px] text-neutral-400">Raid Immunity</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-sm font-bold text-white font-mono">&lt; 0.4s</div>
                  <div className="text-[10px] text-neutral-400">Role Assign Time</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl space-y-3"
            >
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-2 text-xs text-neutral-400 pb-2 border-b border-white/[0.06]">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>#ticket-0418 · Autonomous Moderator Thread</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-white/[0.03] text-xs text-neutral-300">
                    <span className="font-semibold text-neutral-400 block mb-1">User:</span>
                    &quot;Hey, I boosted the server but I don&apos;t have access to the exclusive VIP lounge. How do I get it?&quot;
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                    <div className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Layer Autonomous AI</span>
                    </div>
                    &quot;Hello! Your Discord Nitro Booster role was automatically synchronized. I just validated your membership and unlocked #vip-lounge for you! 🎉&quot;
                  </div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs text-neutral-400">
                <span>Autonomous Ticket Resolution</span>
                <span className="text-purple-400 font-mono font-semibold">Saved 12m of staff time</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'radar' && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl space-y-3"
            >
              <div className="p-4 rounded-2xl bg-rose-500/[0.03] border border-rose-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> BAN EVASION RADAR
                  </span>
                  <span className="text-neutral-500">Heuristic Correlation</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-neutral-300">
                    <span>Source Ban:</span>
                    <span className="text-neutral-400">ToxicMember#0001 (Banned 2h ago)</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>New Join Signature:</span>
                    <span className="text-rose-400">NewAccount#9841 (Joined 3s ago)</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Behavioral Match:</span>
                    <span className="text-emerald-400 font-bold">98.4% Confidence</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-neutral-300">Automatic Action Taken:</span>
                <span className="text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                  Pre-emptive Shadow Ban
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Bento Grid (Apple Pro Style) ───────────────────────────── */
function BentoFeatures() {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center space-y-4 mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>Next-Generation Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
          Built for communities that demand perfection.
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Every component in Layer has been re-engineered from the socket level. Uncompromising speed, zero telemetry bloat, and surgical precision.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1 (Span 2) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="md:col-span-2 rounded-3xl p-7 sm:p-9 bg-neutral-950/60 border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-500 relative overflow-hidden group shadow-xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/[0.12] transition-colors duration-500" />
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Neural Optical Scam Destruction
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
              Scammers bypass normal text filters by posting screenshots and promotional images. Layer&apos;s neural OCR model parses embedded text inside images in 14ms and incinerates malicious links before anyone clicks.
            </p>
            <div className="pt-4 flex flex-wrap gap-2 text-xs font-mono text-neutral-400">
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Deep OCR Inspection</span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Nitro Scam Quota 0%</span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Sub-20ms Pipeline</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2 (Span 1) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="rounded-3xl p-7 sm:p-9 bg-neutral-950/60 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden group shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Zero-Data Privacy</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We collect 0 IP addresses, 0 personal chat histories, and 0 email addresses. Everything runs ephemerally in-memory.
            </p>
          </div>
          <div className="pt-6 border-t border-white/[0.06] text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>GDPR & Privacy Native</span>
          </div>
        </motion.div>

        {/* Card 3 (Span 1) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="rounded-3xl p-7 sm:p-9 bg-neutral-950/60 border border-white/[0.08] hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden group shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">AI Server Architect</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Use <code className="text-purple-300 font-mono text-xs bg-purple-500/20 px-1.5 py-0.5 rounded">/setup</code> and Gemini AI builds an entire categorized Discord server layout with tailored permissions in 5 seconds.
            </p>
          </div>
          <div className="pt-6 border-t border-white/[0.06] text-xs font-mono text-purple-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>Instant Channel Generation</span>
          </div>
        </motion.div>

        {/* Card 4 (Span 2) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="md:col-span-2 rounded-3xl p-7 sm:p-9 bg-neutral-950/60 border border-white/[0.08] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden group shadow-xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/[0.12] transition-colors duration-500" />
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Lossless 24-Bit Audiophile Playback
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
              Crystal-clear, jitter-free audio with YouTube, Spotify, and Twitch extractors. Full queue management, bass boost, volume normalization, and zero lag on voice nodes.
            </p>
            <div className="pt-4 flex flex-wrap gap-2 text-xs font-mono text-neutral-400">
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">High-Bitrate Opus</span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Global Audio Queue</span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">No Paywall on Sound</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Apple Comparison Matrix ────────────────────────────────── */
function AppleComparison() {
  const comparisonItems = [
    { feature: 'Neural OCR Scam Scanner (Reads image text)', layer: true, legacy: false },
    { feature: 'Zero-Storage Privacy (0 IPs or logs stored)', layer: true, legacy: false },
    { feature: 'Autonomous AI Ticket Resolution', layer: true, legacy: false },
    { feature: 'Autonomous Server Setup in 5s (/setup)', layer: true, legacy: false },
    { feature: 'Free Unlimited High-Bitrate Music', layer: true, legacy: false },
    { feature: 'Full Audit Logs & Role Management Included', layer: true, legacy: 'Paid Tier' },
    { feature: 'Clean Modern Web Dashboard (Zero Adware)', layer: true, legacy: false },
  ];

  return (
    <section id="security" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center space-y-4 mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Why server owners leave legacy bots behind.
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto">
          Bots from 2018 lock essential security behind $15/month subscriptions. Layer provides enterprise-grade performance out of the box.
        </p>
      </motion.div>

      <div className="rounded-3xl border border-white/[0.08] bg-neutral-950/70 overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-12 p-4 sm:p-5 border-b border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-neutral-400">
          <div className="col-span-6 sm:col-span-7">Capability</div>
          <div className="col-span-3 sm:col-span-3 text-center text-cyan-400 font-bold">Layer</div>
          <div className="col-span-3 sm:col-span-2 text-center text-neutral-500">Legacy Bots</div>
        </div>

        <div className="divide-y divide-white/[0.04] text-xs sm:text-sm">
          {comparisonItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white/[0.015] transition-colors">
              <div className="col-span-6 sm:col-span-7 font-medium text-neutral-200">
                {item.feature}
              </div>
              <div className="col-span-3 sm:col-span-3 flex justify-center">
                <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
              <div className="col-span-3 sm:col-span-2 flex justify-center text-neutral-500 font-mono text-xs">
                {typeof item.legacy === 'string' ? (
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 text-[11px]">{item.legacy}</span>
                ) : item.legacy ? (
                  <Check className="w-4 h-4 text-neutral-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-neutral-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Apple Accordion FAQ ────────────────────────────────────── */
function AppleFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Does Layer actually read text inside uploaded pictures?',
      a: 'Yes. Layer employs an on-the-fly Neural Optical Character Recognition (OCR) model that evaluates images in under 18ms. If a scammer attempts to post a screenshot containing a fake Nitro URL, a phishing link, or malicious Discord gift clone, it is destroyed before any member can open it.',
    },
    {
      q: 'How does the Zero-Data verification work?',
      a: 'Unlike third-party verification bots that force users onto an external browser website to harvest IP addresses and device fingerprints, Layer performs cryptographic role-verification directly inside Discord buttons. Zero personal data leaves the Discord ecosystem.',
    },
    {
      q: 'What permissions does Layer need to operate?',
      a: 'Layer strictly asks for standard management permissions (Manage Roles, Manage Channels, Moderate Members, and Send Messages). We never request Administrator rights unless you specifically use the /setup full-server rebuild utility.',
    },
    {
      q: 'Can I keep my existing roles and channels?',
      a: 'Absolutely. Layer operates seamlessly alongside your existing server infrastructure. You can activate modules individually (e.g. only OCR Anti-Scam or only Music) from your web dashboard at uselayer.de.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="text-center space-y-3 mb-14">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
        <p className="text-neutral-400 text-sm">Everything you need to know about the architecture.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/[0.08] bg-neutral-950/60 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-neutral-200 hover:text-white transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Apple Grand Finale CTA ─────────────────────────────────── */
function AppleCTA() {
  return (
    <section className="py-28 px-4 sm:px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-c from-cyan-600/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 mx-auto shadow-[0_0_40px_rgba(34,211,238,0.4)]">
          <div className="w-full h-full rounded-[22px] bg-black flex items-center justify-center">
            <Image src="/logo.png" alt="Layer" width={34} height={34} className="object-contain" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Your community deserves <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            the next standard.
          </span>
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Setup takes less than 60 seconds. Free to deploy, privacy-first by design.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/invite"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
          >
            <span>Add Layer to Discord</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-neutral-300 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] transition-all duration-300"
          >
            <span>Launch Web Dashboard</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Apple Footer ───────────────────────────────────────────── */
function AppleFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-black/80 py-14 px-4 sm:px-6 text-xs text-neutral-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Layer" width={20} height={20} className="opacity-80" />
          <span className="text-neutral-400 font-semibold">Layer Bot &copy; {new Date().getFullYear()}</span>
          <span className="text-neutral-600">·</span>
          <span>Crafted for Discord</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-400">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/refunds" className="hover:text-white transition-colors">
            Refunds
          </Link>
          <Link href="/security" className="hover:text-white transition-colors">
            Security Whitepaper
          </Link>
          <Link href="/premium" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE ROOT
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">
      {/* Subtle Apple Ambient Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-cyan-500/[0.15] via-blue-600/[0.05] to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] left-1/4 w-[600px] h-[600px] bg-purple-600/[0.06] rounded-full blur-[160px] pointer-events-none" />

      {/* Floating Navigation */}
      <AppleNav />

      {/* Hero Section */}
      <section className="pt-32 sm:pt-44 pb-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6 max-w-3xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl text-neutral-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>Layer 2.5 Architecture</span>
            <span className="text-neutral-500">|</span>
            <span className="text-cyan-400">Zero-Compromise Security</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Precision Moderation. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Engineered for Discord.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-neutral-400 text-sm sm:text-lg leading-relaxed max-w-xl mx-auto">
            Layer analyzes threats in real-time before members are exposed. From sub-millisecond OCR scam image filtering to autonomous AI ticket routing and zero-storage verification.
          </p>

          {/* Call to action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/invite"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
            >
              <span>Add to Discord</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#interactive"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-neutral-300 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] transition-all duration-300"
            >
              <span>Explore Live Engine</span>
            </a>
          </div>

          {/* Metric Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Sub-20ms Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Zero User Telemetry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Gemini Neural Core</span>
            </div>
          </div>
        </motion.div>

        {/* Live Engine Interactive Simulator */}
        <div id="interactive" className="mt-16 sm:mt-24">
          <EngineSimulator />
        </div>
      </section>

      {/* Bento Grid */}
      <BentoFeatures />

      {/* Comparison Matrix */}
      <AppleComparison />

      {/* FAQ Accordion */}
      <AppleFAQ />

      {/* Finale CTA */}
      <AppleCTA />

      {/* Clean Footer */}
      <AppleFooter />
    </div>
  );
}
