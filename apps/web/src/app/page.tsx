'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Award,
  Sparkles,
  Bot,
  ExternalLink,
  MessageSquare,
  Users,
  Search,
  Lock,
  Flame,
  Radio,
  ArrowRight,
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

  // Interactive Raid Simulation State
  const [raidPurged, setRaidPurged] = useState(false);

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
      setTimeout(() => setVerifyStatus('verified'), 750);
    } else if (verifyStatus === 'verified') {
      setVerifyStatus('idle');
    }
  };

  const faqs = [
    {
      q: 'Is Layer completely free to start?',
      a: 'Yes. Layer can be invited to any Discord server instantly. Essential protection, OCR scam scanning, basic leveling, and music features are free forever.',
    },
    {
      q: 'Will legitimate users get banned by mistake?',
      a: 'No. Layer uses high-confidence neural OCR and multi-factor validation. Borderline cases are automatically quarantined or flagged to moderators rather than hard-banned.',
    },
    {
      q: 'Do you store member IP addresses or private messages?',
      a: 'Never. Layer is architected with a strict zero-telemetry policy. We do not store member IPs, chat histories, or private data. Threat analysis occurs ephemerally in-memory.',
    },
    {
      q: 'How long does setup take?',
      a: 'Under 60 seconds. Simply invite the bot, grant recommended permissions, and Layer runs autonomous protection out-of-the-box with sensible defaults.',
    },
    {
      q: 'Can I customize punishment thresholds?',
      a: 'Yes. From your web dashboard at uselayer.de, you can adjust actions (timeout, kick, ban) and fine-tune OCR sensitivity for your specific community.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#111215] text-[#F5EFEB] font-sans selection:bg-[#EFE8DE] selection:text-[#111215] overflow-x-hidden">
      
      {/* ─── Top Ambient Glow (Warm Cream / Soft Taupe) ───────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#EFE8DE]/[0.05] via-[#EFE8DE]/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      {/* ─── 1. Header / Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111215]/80 backdrop-blur-xl border-b border-[#EFE8DE]/[0.07] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#EFE8DE]/[0.08] border border-[#EFE8DE]/[0.15] flex items-center justify-center transition-all group-hover:border-[#EFE8DE]/30">
              <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain" priority />
            </div>
            <span className="font-bold text-base tracking-tight text-[#FAF6F0]">Layer</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-[#A8A49C]">
            <a href="#features" className="hover:text-[#FAF6F0] transition-colors">Features</a>
            <a href="#control-panel" className="hover:text-[#FAF6F0] transition-colors">Control Panel</a>
            <a href="#how-it-works" className="hover:text-[#FAF6F0] transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-[#FAF6F0] transition-colors">FAQ</a>
            <Link href="/commands" className="hover:text-[#FAF6F0] transition-colors">Commands</Link>
            <Link href="/premium" className="hover:text-[#FAF6F0] transition-colors">Pricing</Link>
          </div>

          {/* CTA Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#A8A49C] hover:text-[#FAF6F0] px-3 py-1.5 transition-colors hidden sm:block"
            >
              Dashboard
            </Link>
            <Link
              href="/invite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#111215] bg-[#EFE8DE] hover:bg-[#FAF6F0] shadow-[0_2px_14px_rgba(239,232,222,0.18)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <DiscordIcon size={15} />
              <span>Invite Layer</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── 2. Hero Section ───────────────────────────────────── */}
      <section className="relative z-10 pt-36 sm:pt-44 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#EFE8DE] bg-[#EFE8DE]/[0.08] border border-[#EFE8DE]/[0.15]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              <span>Layer 2.0 · Autonomous Discord Defense</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#FAF6F0] leading-[1.08]">
              The bot that <br />
              <span className="text-[#EFE8DE] underline decoration-[#EFE8DE]/20 underline-offset-8">
                protects your server.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A8A49C] leading-relaxed max-w-lg">
              Autonomous scam interception, image-embedded OCR detection, zero-IP verification, and instant raid shielding for Discord communities.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/invite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-[#111215] bg-[#EFE8DE] hover:bg-[#FAF6F0] shadow-[0_4px_24px_rgba(239,232,222,0.2)] transition-all hover:scale-105 active:scale-95"
              >
                <DiscordIcon size={18} />
                <span>Invite Layer</span>
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-[#FAF6F0] bg-[#18191F] hover:bg-[#20222a] border border-[#EFE8DE]/[0.1] transition-all"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 text-[#A8A49C]" />
              </a>
            </div>

            <div className="pt-3 flex items-center gap-6 text-xs text-[#A8A49C]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Zero telemetry stored</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Instant 60s setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Free to use</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Preview Window (Discord Floating Interception Pill) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-2xl bg-[#17181D] border border-[#EFE8DE]/[0.1] p-5 space-y-4 shadow-2xl relative">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <span className="text-[11px] font-mono text-[#A8A49C] ml-2">#security-feed</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20">
                  LIVE INTERCEPT
                </span>
              </div>

              {/* Message 1: Attacker */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1D1E24]/60 border border-white/[0.04]">
                <div className="w-8 h-8 rounded-full bg-[#2A2B33] flex items-center justify-center text-xs font-bold text-[#A8A49C]">
                  SP
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#FAF6F0]">SpamBot#4819</span>
                    <span className="text-[10px] text-[#73716B]">13:42</span>
                  </div>
                  <div className="text-xs text-[#F87171] font-mono bg-[#F87171]/10 px-2 py-1 rounded inline-block">
                    [REDACTED PHISHING URL]
                  </div>
                </div>
              </div>

              {/* Message 2: Layer Bot Action */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#15161B] border border-[#EFE8DE]/[0.14]">
                <div className="w-8 h-8 rounded-full bg-[#EFE8DE] flex items-center justify-center text-xs font-bold text-[#111215]">
                  <ShieldCheck className="w-4 h-4 text-[#111215]" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FAF6F0]">Layer</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#5865F2] text-white">BOT</span>
                    <span className="text-[10px] text-[#73716B]">Just now</span>
                  </div>
                  <p className="text-xs text-[#A8A49C] leading-snug">
                    <span className="text-[#34D399] font-medium">Threat neutralized in 12ms.</span> Malicious message deleted, user quarantined, and audit log dispatched.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#EFE8DE]/70 pt-1">
                    <span>Target: discord-nitro-drop.ru</span>
                    <span>·</span>
                    <span className="text-[#34D399]">Safe</span>
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#A8A49C]">
                <span>Reaction Time: <strong className="text-[#FAF6F0]">12ms</strong></span>
                <span>Audit Stored: <strong className="text-[#FAF6F0]">Memory Only</strong></span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── 3. Minimal Metrics Bar ────────────────────────────── */}
      <section className="relative z-10 border-y border-[#EFE8DE]/[0.07] bg-[#141519]/70 py-6 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#FAF6F0]">18,500+</div>
            <div className="text-xs text-[#A8A49C] mt-0.5">Members Protected</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#FAF6F0]">&lt; 14ms</div>
            <div className="text-xs text-[#A8A49C] mt-0.5">Average Intercept Speed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#FAF6F0]">100%</div>
            <div className="text-xs text-[#A8A49C] mt-0.5">Zero Data Retention</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#FAF6F0]">99.98%</div>
            <div className="text-xs text-[#A8A49C] mt-0.5">Uptime Reliability</div>
          </div>
        </div>
      </section>

      {/* ─── 4. GRAND FEATURE SHOWCASE (Scroll-Driven Linear Journey) ─── */}
      <section id="features" className="relative z-10 py-28 px-6 max-w-6xl mx-auto space-y-36">

        {/* Section Intro */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#EFE8DE] bg-[#EFE8DE]/[0.06] border border-[#EFE8DE]/[0.12]">
            <span>FEATURE SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FAF6F0]">
            Every attack vector has an answer.
          </h2>
          <p className="text-sm text-[#A8A49C]">
            Watch how Layer defends your community in real-time as threats occur.
          </p>
        </div>

        {/* ─── SHOWCASE 1: Neural OCR Scam Vision ─── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Text Left */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#EFE8DE]">
              <Eye className="w-4 h-4 text-[#EFE8DE]" />
              <span>01 · NEURAL OCR VISION</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FAF6F0] tracking-tight leading-tight">
              Scans text hidden inside images.
            </h3>
            <p className="text-sm text-[#A8A49C] leading-relaxed">
              Scammers bypass standard Discord bot filters by uploading fake Discord Nitro screenshots, QR codes, and promo images. Layer’s OCR neural vision reads image contents instantly and wipes phishing attempts in milliseconds.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-[#FAF6F0]">
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                QR &amp; Image OCR
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                &lt; 14ms Detection
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                Automatic Timeout
              </span>
            </div>
          </div>

          {/* Interactive OCR Discord Mockup Right */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#17181D] border border-[#EFE8DE]/[0.1] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Channel Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#FAF6F0]">#general</span>
                  <span className="text-xs text-[#73716B]">· 1,420 members</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#34D399] bg-[#34D399]/10 px-2.5 py-1 rounded-full border border-[#34D399]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
                  <span>OCR SCANNER ACTIVE</span>
                </div>
              </div>

              {/* Discord Attachment Mockup with Animated Laser Scanner */}
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2A2B33] flex items-center justify-center text-xs font-bold text-[#A8A49C]">
                    HK
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FAF6F0]">HackedUser_77</span>
                      <span className="text-[10px] text-[#73716B]">13:44</span>
                    </div>
                    <p className="text-xs text-[#FAF6F0]">omg guys claim your free 1 month nitro here before it expires!!</p>

                    {/* Image with Laser Scan Line */}
                    <div className="relative rounded-xl overflow-hidden border border-[#F87171]/40 bg-[#121316] p-4 max-w-md">
                      <motion.div
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F87171] to-transparent shadow-[0_0_12px_#F87171] z-20"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-[#FAF6F0] flex items-center gap-2">
                            <span>discord-nitro-gift-claim.png</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F87171]/20 text-[#F87171]">
                              PHISHING DETECTED
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#A8A49C]">
                            Extracted: &ldquo;https://discord.nitro-claim.ru/gift&rdquo;
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bot Intervention Tag */}
                    <div className="p-3 rounded-xl bg-[#121316] border border-[#EFE8DE]/[0.12] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <ShieldAlert className="w-4 h-4 text-[#F87171]" />
                        <span className="text-[#FAF6F0] font-semibold">Message auto-deleted</span>
                        <span className="text-[#73716B]">· User timed out for 24h</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#34D399]">11ms elapsed</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>


        {/* ─── SHOWCASE 2: Instant Raid Shield (Alternating Layout) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Interactive Raid Queue Mockup Left */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-2xl bg-[#17181D] border border-[#EFE8DE]/[0.1] p-5 sm:p-6 shadow-2xl relative space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#FBBF24]" />
                  <span className="text-xs font-bold text-[#FAF6F0]">Raid Containment Pool</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30">
                  {raidPurged ? '0 THREATS' : '42 BOTS QUARANTINED'}
                </span>
              </div>

              {/* Bot Join Surge Representation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A49C]">
                  <span>Incoming join rate</span>
                  <span className="font-mono text-[#F87171] font-bold">42 accounts / 1.2 sec</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#121316] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FBBF24] to-[#F87171]"
                    animate={{ width: raidPurged ? '4%' : '92%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Quarantined Accounts List */}
              <div className="space-y-2 max-h-40 overflow-hidden">
                {!raidPurged ? (
                  <>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121316] border border-white/[0.04] text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F87171]" />
                        <span className="font-mono text-[#FAF6F0]">RaidUser_0942 (Created 2m ago)</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#F87171] bg-[#F87171]/10 px-2 py-0.5 rounded">
                        QUARANTINED
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121316] border border-white/[0.04] text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F87171]" />
                        <span className="font-mono text-[#FAF6F0]">RaidUser_0943 (Created 2m ago)</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#F87171] bg-[#F87171]/10 px-2 py-0.5 rounded">
                        QUARANTINED
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 text-center text-xs text-[#34D399] font-medium">
                    ✓ All 42 raid accounts pruned. Server restored to normal join mode.
                  </div>
                )}
              </div>

              {/* Interactive Purge Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#A8A49C]">Normal members chat uninterrupted</span>
                <button
                  type="button"
                  onClick={() => setRaidPurged(!raidPurged)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#111215] bg-[#EFE8DE] hover:bg-[#FAF6F0] transition-transform active:scale-95"
                >
                  {raidPurged ? 'Reset Simulation' : 'One-Click Purge All'}
                </button>
              </div>

            </div>
          </div>

          {/* Text Right */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#EFE8DE]">
              <Zap className="w-4 h-4 text-[#EFE8DE]" />
              <span>02 · ANTI-RAID SYSTEM</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FAF6F0] tracking-tight leading-tight">
              Neutralize mass bot waves instantly.
            </h3>
            <p className="text-sm text-[#A8A49C] leading-relaxed">
              When a coordinated token raid strikes, Layer detects the statistical velocity anomaly in under 100ms. It instantly quarantines suspect joins without locking out authentic members or crashing your channels.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-[#FAF6F0]">
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                Anomaly Join Velocity
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                Isolated Quarantine
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                1-Click Restore
              </span>
            </div>
          </div>
        </motion.div>


        {/* ─── SHOWCASE 3: Zero-IP Instant Verification ─── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Text Left */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#EFE8DE]">
              <Lock className="w-4 h-4 text-[#EFE8DE]" />
              <span>03 · ZERO-STORAGE VERIFY</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FAF6F0] tracking-tight leading-tight">
              Keep bots out with 0 member data stored.
            </h3>
            <p className="text-sm text-[#A8A49C] leading-relaxed">
              Most verification bots collect IP addresses, browser cookies, and telemetry. Layer uses zero-knowledge verification: fast 1-click verification that passes real humans and rejects automated scrapers without logging personal identifiers.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-[#FAF6F0]">
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                0 IP Addresses Logged
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                1-Click Discord Webhook
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                GDPR &amp; Privacy First
              </span>
            </div>
          </div>

          {/* Interactive Verification Card Mockup Right */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#17181D] border border-[#EFE8DE]/[0.1] p-5 sm:p-6 shadow-2xl relative space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FAF6F0]">#verification</span>
                  <span className="text-[10px] text-[#73716B]">Interactive preview</span>
                </div>
                <span className="text-[10px] font-mono text-[#34D399]">TRY CLICKING VERIFY</span>
              </div>

              {/* Discord Embed Simulation */}
              <div className="rounded-xl bg-[#131418] border-l-4 border-l-[#EFE8DE] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#EFE8DE]" />
                  <span className="text-sm font-bold text-[#FAF6F0]">Community Gatekeeper</span>
                </div>

                <p className="text-xs text-[#A8A49C] leading-relaxed">
                  Welcome to the server! To protect the community from automated spam and scrapers, click the button below to verify your account.
                </p>

                {/* Interactive Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleVerifyClick}
                    disabled={verifyStatus === 'verifying'}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      verifyStatus === 'verified'
                        ? 'bg-[#34D399] text-[#111215]'
                        : 'bg-[#EFE8DE] hover:bg-[#FAF6F0] text-[#111215] active:scale-95'
                    }`}
                  >
                    {verifyStatus === 'verifying' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#111215] border-t-transparent rounded-full animate-spin" />
                        <span>Verifying in-memory...</span>
                      </>
                    ) : verifyStatus === 'verified' ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Verified! Role @Member Granted</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify with Layer</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-[10px] font-mono text-[#73716B] flex items-center justify-between border-t border-white/[0.04]">
                  <span>Zero telemetry recorded</span>
                  <span>Average: 14ms</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>


        {/* ─── SHOWCASE 4: Autonomous AI Ticket Co-Pilot ─── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Interactive Ticket Chat Left */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-2xl bg-[#17181D] border border-[#EFE8DE]/[0.1] p-5 sm:p-6 shadow-2xl relative space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#EFE8DE]" />
                  <span className="text-xs font-bold text-[#FAF6F0]">ticket-0418 · Role Issue</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20">
                  AUTO-RESOLVED
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3">
                {/* User Message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2A2B33] flex items-center justify-center text-xs font-bold text-[#A8A49C]">
                    JD
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FAF6F0]">JohnDoe</span>
                      <span className="text-[10px] text-[#73716B]">14:02</span>
                    </div>
                    <p className="text-xs text-[#FAF6F0] bg-[#121316] p-3 rounded-xl border border-white/[0.04]">
                      Hey! I just boosted the server but my VIP role hasn&apos;t been synced yet. Could someone look into this?
                    </p>
                  </div>
                </div>

                {/* Layer AI Co-Pilot Response */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFE8DE] flex items-center justify-center text-xs font-bold text-[#111215]">
                    <Bot className="w-4 h-4 text-[#111215]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FAF6F0]">Layer Co-Pilot</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#5865F2] text-white">BOT</span>
                      <span className="text-[10px] text-[#73716B]">14:02 (2.4s later)</span>
                    </div>
                    <div className="text-xs text-[#FAF6F0] bg-[#14151B] p-3.5 rounded-xl border border-[#EFE8DE]/[0.15] space-y-2">
                      <p>
                        Hi JohnDoe! I checked the Discord guild events and confirmed your active server boost.
                      </p>
                      <p className="text-[#34D399] font-medium">
                        ✓ Assigned @Server Booster &amp; @VIP roles to your account.
                      </p>
                      <p className="text-[11px] text-[#A8A49C]">
                        Ticket will be archived automatically in 5 minutes unless you need more help!
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-[#73716B]">
                <span>Resolution Time: <strong className="text-[#FAF6F0]">2.4 seconds</strong></span>
                <span>Staff Pings: <strong className="text-[#34D399]">0 required</strong></span>
              </div>

            </div>
          </div>

          {/* Text Right */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#EFE8DE]">
              <Sparkles className="w-4 h-4 text-[#EFE8DE]" />
              <span>04 · AI TICKET CO-PILOT</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FAF6F0] tracking-tight leading-tight">
              Resolve support tickets while your staff sleeps.
            </h3>
            <p className="text-sm text-[#A8A49C] leading-relaxed">
              Layer understands your server context, rules, and role structures. It automatically resolves 80%+ of common tickets—such as boost perks, role syncs, and FAQ inquiries—in under 3 seconds without pinging human moderators.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-[#FAF6F0]">
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                Context-Aware LLM
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                Automated Role Sync
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                Transcript Archival
              </span>
            </div>
          </div>
        </motion.div>


        {/* ─── SHOWCASE 5: Music & Leveling XP ─── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Text Left */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#EFE8DE]">
              <Volume2 className="w-4 h-4 text-[#EFE8DE]" />
              <span>05 · MUSIC &amp; ENGAGEMENT</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FAF6F0] tracking-tight leading-tight">
              High-bitrate audio &amp; active member rewards.
            </h3>
            <p className="text-sm text-[#A8A49C] leading-relaxed">
              Keep voice channels alive with crystal-clear 320kbps music playback and gamify chat activity with sleek rank cards, custom role rewards, and zero audio stutter.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-[#FAF6F0]">
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                320kbps Lossless
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                Dynamic Level XP
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#181920] border border-white/[0.06]">
                24/7 Radio Mode
              </span>
            </div>
          </div>

          {/* Music & Rank Widget Mockup Right */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-[#17181D] border border-[#EFE8DE]/[0.1] p-5 sm:p-6 shadow-2xl relative space-y-4">
              
              {/* Music Player Bar */}
              <div className="p-4 rounded-xl bg-[#131418] border border-white/[0.04] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1D1E24] flex items-center justify-center">
                    <Radio className="w-5 h-5 text-[#EFE8DE]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#FAF6F0]">Lofi Midnight Radio · 24/7 Stream</div>
                    <div className="text-[11px] text-[#A8A49C]">Voice Channel: Lounge 🎵</div>
                  </div>
                </div>

                {/* Animated Equalizer Waves */}
                <div className="flex items-end gap-1 h-5">
                  {[40, 80, 50, 95, 30, 70, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-[#EFE8DE] rounded-full"
                      animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] }}
                      transition={{ duration: 0.9 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>

              {/* Level XP Card */}
              <div className="p-4 rounded-xl bg-[#131418] border border-white/[0.04] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EFE8DE] text-[#111215] flex items-center justify-center font-bold text-xs">
                      #3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#FAF6F0]">Sarah · Level 38</div>
                      <div className="text-[10px] text-[#73716B]">Active Chatter · @Diamond Rank</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#EFE8DE]">8,450 / 10,000 XP</span>
                </div>

                <div className="h-2 w-full rounded-full bg-[#1A1B22] overflow-hidden">
                  <div className="h-full bg-[#EFE8DE] rounded-full" style={{ width: '84.5%' }} />
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </section>


      {/* ─── 5. INTERACTIVE CONTROL CENTER (Protector / Dashboard Style) ─── */}
      <section id="control-panel" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-[#17181D] border border-[#EFE8DE]/[0.1] p-7 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#EFE8DE] bg-[#EFE8DE]/[0.08] border border-[#EFE8DE]/[0.15]">
                <Sliders className="w-3.5 h-3.5" />
                <span>CENTRALIZED DASHBOARD</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#FAF6F0] tracking-tight leading-tight">
                Control your protections from the browser.
              </h2>

              <p className="text-xs sm:text-sm text-[#A8A49C] leading-relaxed">
                Toggle shields, configure auto-moderation rules, set OCR confidence thresholds, and manage your server right from your Layer dashboard.
              </p>

              <div className="p-4 rounded-xl bg-[#121316] border border-white/[0.04] space-y-1">
                <div className="text-xs font-bold text-[#FAF6F0]">Active Defense Matrix</div>
                <div className="text-[11px] text-[#34D399] font-mono">
                  {activeSystemsCount} of 5 systems online · 0 vulnerabilities detected
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-[#111215] bg-[#EFE8DE] hover:bg-[#FAF6F0] transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Open Web Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Toggle Stack */}
            <div className="lg:col-span-7 space-y-3">
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
                    className="flex items-center justify-between p-4 rounded-xl bg-[#131418] border border-white/[0.05] hover:border-[#EFE8DE]/[0.2] cursor-pointer transition-all"
                  >
                    <div className="space-y-0.5 pr-4">
                      <div className="text-xs font-bold text-[#FAF6F0]">{item.label}</div>
                      <div className="text-[11px] text-[#A8A49C]">{item.desc}</div>
                    </div>

                    {/* Animated Toggle Switch */}
                    <div
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                        isActive ? 'bg-[#EFE8DE]' : 'bg-[#2A2B33]'
                      }`}
                    >
                      <motion.div
                        className={`w-5 h-5 rounded-full ${isActive ? 'bg-[#111215]' : 'bg-[#73716B]'}`}
                        animate={{ x: isActive ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </motion.div>
      </section>


      {/* ─── 6. HOW IT WORKS (Quick Linear Progress Timeline) ──── */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-[#FAF6F0] tracking-tight">
            Protected in under 60 seconds.
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A49C]">
            No complex JSON configs. Just invite and let the autonomous engine work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Invite Layer', desc: 'Add bot with recommended permissions' },
            { step: '02', title: 'Auto-Config', desc: 'Pre-tuned threat filters deploy automatically' },
            { step: '03', title: 'Threat Strikes', desc: 'Phishing image or bot flood attempts entry' },
            { step: '04', title: 'Sub-14ms Intercept', desc: 'Deleted, quarantined, and audited quietly' },
            { step: '05', title: 'Zero Worry', desc: 'Your community stays clean 24/7' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#17181D] border border-white/[0.05] space-y-2 relative"
            >
              <div className="text-xs font-mono font-bold text-[#EFE8DE]">{item.step}</div>
              <h3 className="text-sm font-bold text-[#FAF6F0]">{item.title}</h3>
              <p className="text-xs text-[#A8A49C] leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ─── 7. FAQ Section (Accordion) ─────────────────────────── */}
      <section id="faq" className="relative z-10 py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#FAF6F0] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A49C]">
            Everything you need to know about Layer security and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#17181D] border border-white/[0.05] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#FAF6F0]">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A8A49C] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#FAF6F0]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#A8A49C] leading-relaxed border-t border-white/[0.03] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* ─── 8. Bottom CTA Banner (Warm Cream High-Contrast Banner) ─── */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-14 bg-[#EFE8DE] text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-[#111215] tracking-tight leading-tight">
              Don&apos;t wait for the next raid to secure your server.
            </h2>
            <p className="text-xs sm:text-sm text-[#111215]/80 font-medium leading-relaxed">
              Join thousands of Discord communities already secured by Layer. Free to setup in under 60 seconds.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/invite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#FAF6F0] bg-[#111215] hover:bg-black shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                <DiscordIcon size={18} />
                <span>Invite Layer to Discord</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ─── 9. Minimalist Footer ───────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#EFE8DE]/[0.07] bg-[#0E0F12] py-12 px-6 text-xs text-[#A8A49C]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Layer" width={20} height={20} className="object-contain" />
            <span className="font-bold text-[#FAF6F0]">Layer</span>
            <span className="text-neutral-600">·</span>
            <span>The bot that protects your Discord.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#A8A49C]">
            <Link href="/terms" className="hover:text-[#FAF6F0] transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#FAF6F0] transition-colors">Privacy Policy</Link>
            <Link href="/refunds" className="hover:text-[#FAF6F0] transition-colors">Refunds</Link>
            <Link href="/commands" className="hover:text-[#FAF6F0] transition-colors">Commands</Link>
            <Link href="/premium" className="hover:text-[#FAF6F0] transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
