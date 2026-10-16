'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  Zap,
  Bot,
  Lock,
  Sparkles,
  ChevronRight,
  Check,
  ArrowRight,
  Eye,
  AlertTriangle,
  Activity,
  Layers,
  ChevronDown,
  Clock,
  Sliders,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Users,
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

  // Interactive Switch States (like Image 2 - Protector)
  const [switches, setSwitches] = useState({
    antiScam: true,
    ocrVision: true,
    antiRaid: true,
    aiTickets: true,
  });

  const toggleSwitch = (key: keyof typeof switches) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqs = [
    {
      q: 'Is Layer free to use?',
      a: 'Yes! Layer is free to invite and start protecting your server immediately. Essential protection, OCR anti-scam, leveling, and music are included without required payment.',
    },
    {
      q: 'Will Layer ban legitimate users by accident?',
      a: 'No. Layer uses multi-factor validation and optical character recognition (OCR) with 98%+ confidence thresholding. If a message is borderline, it warns or quarantines instead of auto-banning.',
    },
    {
      q: 'Does Layer log user IP addresses or private messages?',
      a: 'Never. Layer is built strictly privacy-first. We do not store member IPs, private message histories, or emails. Everything runs ephemerally in-memory.',
    },
    {
      q: 'Can I customize the punishment actions?',
      a: 'Yes. Through your web dashboard at uselayer.de, you can configure whether Layer deletes the message, warns the user, times them out, or bans them immediately.',
    },
    {
      q: 'Does it work in all servers?',
      a: 'Yes, Layer works on any Discord server. From small gaming communities to massive 100,000+ member hubs, setup takes under 60 seconds.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e0f11] text-[#F5F4F5] font-sans selection:bg-[#1FA7BB] selection:text-[#0e0f11] overflow-x-hidden">
      
      {/* ─── 1. Header / Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0e0f11]/85 backdrop-blur-md border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1FA7BB]/10 border border-[#1FA7BB]/30 flex items-center justify-center">
              <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain" priority />
            </div>
            <span className="font-bold text-base tracking-tight text-[#F5F4F5]">Layer</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#A8A9A2]">
            <a href="#features" className="hover:text-[#F5F4F5] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#F5F4F5] transition-colors">How It Works</a>
            <a href="#protection" className="hover:text-[#F5F4F5] transition-colors">Control Panel</a>
            <a href="#faq" className="hover:text-[#F5F4F5] transition-colors">FAQ</a>
            <Link href="/commands" className="hover:text-[#F5F4F5] transition-colors">Commands</Link>
            <Link href="/premium" className="hover:text-[#F5F4F5] transition-colors">Pricing</Link>
          </div>

          {/* Actions */}
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0e0f11] bg-[#1FA7BB] hover:bg-[#25bdd3] shadow-[0_2px_12px_rgba(31,167,187,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <DiscordIcon size={15} />
              <span>Invite Layer</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── 2. Hero Section (Inspired by Honeypot Image 1) ────── */}
      <section className="pt-36 sm:pt-44 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F5F4F5] leading-[1.08]">
              The bot that <br />
              <span className="text-[#1FA7BB]">protects your server.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#A8A9A2] leading-relaxed max-w-lg">
              Layer automatically catches scam links, reads text hidden inside phishing images, and neutralizes malicious raids before your members can click.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/invite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-[#0e0f11] bg-[#1FA7BB] hover:bg-[#25bdd3] shadow-[0_0_24px_rgba(31,167,187,0.35)] transition-all hover:scale-105 active:scale-95"
              >
                <DiscordIcon size={18} />
                <span>Invite Layer</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-[#F5F4F5] bg-[#121315] hover:bg-[#1a1c20] border border-white/[0.08] transition-all"
              >
                <span>Open Dashboard</span>
                <ChevronRight className="w-4 h-4 text-[#A8A9A2]" />
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A8A9A2] pt-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>Zero IP Logging · 100% Privacy Focused · Actively Maintained</span>
            </div>
          </div>

          {/* Right Visual: Floating Discord Protection Badges (Like Image 1) */}
          <div className="lg:col-span-5 relative flex flex-col gap-3.5 items-end">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#1FA7BB]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Bubble 1: Spammer Warning */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-md p-3.5 rounded-2xl bg-[#121315] border border-red-500/25 shadow-xl flex items-center justify-between gap-3 relative z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs">
                  ✕
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F5F4F5] flex items-center gap-1.5">
                    <span>Spammer#1337</span>
                    <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded font-mono">BLOCKED</span>
                  </div>
                  <div className="text-[11px] text-[#A8A9A2] truncate max-w-[200px] sm:max-w-xs">
                    Get free crypto from link...
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">just now</span>
            </motion.div>

            {/* Bubble 2: Layer Action Confirmation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="w-full max-w-md p-3.5 rounded-2xl bg-[#121315] border border-[#1FA7BB]/30 shadow-xl flex items-center justify-between gap-3 relative z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1FA7BB]/20 border border-[#1FA7BB]/40 flex items-center justify-center">
                  <Image src="/logo.png" alt="Layer" width={18} height={18} className="object-contain" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F5F4F5] flex items-center gap-1.5">
                    <span>Layer</span>
                    <span className="text-[10px] text-[#1FA7BB] bg-[#1FA7BB]/15 px-1.5 py-0.2 rounded font-bold font-mono">BOT</span>
                  </div>
                  <div className="text-[11px] text-[#1FA7BB] font-medium">
                    User quarantined and messages deleted ✓
                  </div>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </motion.div>

            {/* Bubble 3: Channel Protected Notice */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full max-w-md p-3 rounded-2xl bg-[#121315]/80 border border-white/[0.06] flex items-center gap-3 relative z-10"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs">
                #
              </div>
              <div className="text-xs">
                <span className="font-semibold text-neutral-300">#security-log:</span>{' '}
                <span className="text-neutral-400">Server auto-locked. 0 members affected.</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── 3. Stats Bar (Like Image 1 - Honeypot) ─────────── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-[#121315] border border-white/[0.06] shadow-xl">
          <div className="p-4 rounded-xl bg-white/[0.02] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1FA7BB]/10 text-[#1FA7BB]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#F5F4F5] font-mono tracking-tight">18,500+</div>
              <div className="text-xs text-[#A8A9A2]">Members Protected</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#F5F4F5] font-mono tracking-tight">&lt; 14ms</div>
              <div className="text-xs text-[#A8A9A2]">Reaction Time</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#F5F4F5] font-mono tracking-tight">100%</div>
              <div className="text-xs text-[#A8A9A2]">Zero Data Logged</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#F5F4F5] font-mono tracking-tight">24/7</div>
              <div className="text-xs text-[#A8A9A2]">Always Online</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Why Choose Layer? (4 Clean Cards like Image 1) ── */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F4F5]">
            Why Choose Layer?
          </h2>
          <p className="text-sm text-[#A8A9A2] max-w-md mx-auto">
            Lightweight, relentless protection without complicating your server.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#121315] border border-white/[0.06] hover:border-[#1FA7BB]/40 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F4F5]">Instant Protection</h3>
            <p className="text-xs text-[#A8A9A2] leading-relaxed">
              Automatically deletes phishing links and spam the moment they are posted in any channel.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#121315] border border-white/[0.06] hover:border-emerald-500/40 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F4F5]">Neural Image OCR</h3>
            <p className="text-xs text-[#A8A9A2] leading-relaxed">
              Reads text hidden inside screenshots and pictures to catch fake Discord Nitro giveaways before anyone clicks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#121315] border border-white/[0.06] hover:border-orange-500/40 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F4F5]">Zero-IP Verification</h3>
            <p className="text-xs text-[#A8A9A2] leading-relaxed">
              One-click verification buttons directly inside Discord. No suspicious external links or browser cookies.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#121315] border border-white/[0.06] hover:border-purple-500/40 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F4F5]">Easy Setup</h3>
            <p className="text-xs text-[#A8A9A2] leading-relaxed">
              Use <code className="text-[#1FA7BB] bg-white/[0.04] px-1 py-0.5 rounded font-mono">/setup</code> or our web dashboard. Set it once and let Layer do the heavy lifting.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. How It Works (5 Step Flow from Image 1) ────────── */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.04]">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F4F5]">
            How It Works
          </h2>
          <p className="text-sm text-[#A8A9A2] max-w-md mx-auto">
            From invite to full raid protection in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#121315] border border-white/[0.06] text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center mx-auto">
              <DiscordIcon size={20} />
            </div>
            <div className="text-xs font-bold text-[#F5F4F5]">1. Bot Joins</div>
            <p className="text-[11px] text-[#A8A9A2] leading-relaxed">
              Invite Layer to your server with one click.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#121315] border border-white/[0.06] text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#F5F4F5]">2. Auto-Config</div>
            <p className="text-[11px] text-[#A8A9A2] leading-relaxed">
              Enable OCR scam filters & verification channels.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#121315] border border-white/[0.06] text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#F5F4F5]">3. Spammer Hits</div>
            <p className="text-[11px] text-[#A8A9A2] leading-relaxed">
              Bad actor posts a phishing screenshot or raid link.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-[#121315] border border-white/[0.06] text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#F5F4F5]">4. Instant Action</div>
            <p className="text-[11px] text-[#A8A9A2] leading-relaxed">
              Layer incinerates the threat and quarantines the user in 14ms.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 rounded-2xl bg-[#121315] border border-white/[0.06] text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#F5F4F5]">5. Clean Audit Log</div>
            <p className="text-[11px] text-[#A8A9A2] leading-relaxed">
              Detailed incident report logged to your mod channel.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. Control Panel from Browser (Like Image 2 - Protector) ── */}
      <section id="protection" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.04]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1FA7BB]/10 text-[#1FA7BB] border border-[#1FA7BB]/20">
              <Sliders className="w-3.5 h-3.5" />
              <span>Dashboard Control</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F4F5] leading-tight">
              Control your protections <br />
              from your browser.
            </h2>
            <p className="text-sm text-[#A8A9A2] leading-relaxed">
              No messy console commands required. Configure every module, manage verified roles, review audit logs, and trigger server auto-locks with simple toggles.
            </p>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-[#0e0f11] bg-[#1FA7BB] hover:bg-[#25bdd3] transition-colors"
              >
                <span>Launch Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Discord Switch UI Mockup (Like Image 2) */}
          <div className="lg:col-span-6 rounded-2xl bg-[#121315] border border-white/[0.08] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#1FA7BB]" />
                <span className="text-xs font-bold text-[#F5F4F5]">Server Protection Settings</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Active & Monitoring
              </span>
            </div>

            <div className="space-y-3">
              {/* Toggle 1: Anti-Scam OCR */}
              <div
                onClick={() => toggleSwitch('antiScam')}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-[#F5F4F5]">Neural Image OCR Scanner</div>
                  <div className="text-[11px] text-[#A8A9A2]">Reads screenshots to detect fake Nitro & gift drops</div>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors ${switches.antiScam ? 'bg-[#1FA7BB]' : 'bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${switches.antiScam ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle 2: Anti-Raid Auto-Quarantine */}
              <div
                onClick={() => toggleSwitch('antiRaid')}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-[#F5F4F5]">Anti-Raid Auto-Quarantine</div>
                  <div className="text-[11px] text-[#A8A9A2]">Temporarily locks channels when mass bot joins occur</div>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors ${switches.antiRaid ? 'bg-[#1FA7BB]' : 'bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${switches.antiRaid ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle 3: One-Click Verification */}
              <div
                onClick={() => toggleSwitch('ocrVision')}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-[#F5F4F5]">Zero-IP Verification Panel</div>
                  <div className="text-[11px] text-[#A8A9A2]">Requires new members to click button before seeing chat</div>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors ${switches.ocrVision ? 'bg-[#1FA7BB]' : 'bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${switches.ocrVision ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle 4: AI Ticket Routing */}
              <div
                onClick={() => toggleSwitch('aiTickets')}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-[#F5F4F5]">Autonomous Ticket AI</div>
                  <div className="text-[11px] text-[#A8A9A2]">Instantly resolves common questions with Gemini 3.8 Flash</div>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors ${switches.aiTickets ? 'bg-[#1FA7BB]' : 'bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${switches.aiTickets ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 7. FAQ + Sidebar (Layout from Image 1 - Honeypot) ── */}
      <section id="faq" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.04]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* FAQ Accordions (Col 8) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F4F5] tracking-tight mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-2.5">
              {faqs.map((f, i) => {
                const isOpen = faqOpen === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.06] bg-[#121315] overflow-hidden"
                  >
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : i)}
                      className="w-full p-4 text-left text-xs sm:text-sm font-semibold text-[#F5F4F5] flex items-center justify-between hover:text-[#1FA7BB] transition-colors"
                    >
                      <span>{f.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#A8A9A2] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1FA7BB]' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#A8A9A2] leading-relaxed border-t border-white/[0.04] pt-2">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Built for Discord Communities Card (Like Image 1 Sidebar) */}
          <div className="lg:col-span-5">
            <div className="p-7 rounded-2xl bg-[#121315] border border-white/[0.08] relative overflow-hidden space-y-5 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center">
                <DiscordIcon size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F5F4F5]">Built for Discord Communities</h3>
                <p className="text-xs text-[#A8A9A2] mt-1 leading-relaxed">
                  Lightweight, reliable, and always watching for malicious activity so you can sleep peacefully.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-[#F5F4F5]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1FA7BB] stroke-[2.5]" />
                  <span>No manual rule setup needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1FA7BB] stroke-[2.5]" />
                  <span>Sub-20ms reaction pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1FA7BB] stroke-[2.5]" />
                  <span>Privacy focused (0 user data stored)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1FA7BB] stroke-[2.5]" />
                  <span>Verified 24/7 online infrastructure</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/invite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-[#0e0f11] bg-[#1FA7BB] hover:bg-[#25bdd3] transition-colors"
                >
                  <DiscordIcon size={16} />
                  <span>Add Layer to Server</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 8. Bottom CTA Banner (Like Image 2 - Protector) ─── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#174F49] via-[#1FA7BB] to-[#25bdd3] text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0e0f11] tracking-tight">
              Don&apos;t let the next raid catch you unprepared.
            </h2>
            <p className="text-xs sm:text-sm text-[#0e0f11]/80 max-w-md mx-auto font-medium">
              Join thousands of Discord communities already secured by Layer. Free to setup in under 60 seconds.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/invite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0e0f11] hover:bg-black shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <DiscordIcon size={18} />
                <span>Add Layer Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Footer (Clean Discord-Bot Style) ─────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#0c0d0f] py-12 px-6 text-xs text-[#A8A9A2]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Layer" width={20} height={20} className="object-contain" />
            <span className="font-bold text-[#F5F4F5]">Layer Bot</span>
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
