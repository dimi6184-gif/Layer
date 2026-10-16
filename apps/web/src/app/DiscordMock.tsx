'use client';

/* ─────────────────────────────────────────────────────────────
   Authentic Discord UI mockup components — used in feature section
   ──────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';

const CHANNEL_BG  = '#313338';
const SIDEBAR_BG  = '#2b2d31';
const MSG_HOVER   = 'rgba(0,0,0,0.06)';
const EMBED_BG    = '#2b2d31';
const TEAL        = '#1FA7BB';

/* ── Shared avatar placeholder ── */
function Avatar({ color, letter, size = 32 }: { color: string; letter: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.44, fontWeight: 700, color: '#fff' }}>
      {letter}
    </div>
  );
}

/* ── Bot badge ── */
function BotBadge() {
  return (
    <span style={{ fontSize: 9, fontWeight: 700, background: '#5865F2', color: '#fff', borderRadius: 3, padding: '1px 4px', lineHeight: 1.4, letterSpacing: '0.02em' }}>
      BOT
    </span>
  );
}

/* ── Single Discord message row ── */
export function DiscordMessage({ avatar, color, username, isBot, time, children, continued }: {
  avatar?: string; color: string; username: string; isBot?: boolean;
  time: string; children: React.ReactNode; continued?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '2px 16px', borderRadius: 4 }}>
      {/* Avatar or spacer */}
      <div style={{ flexShrink: 0, width: 40 }}>
        {!continued && (
          avatar
            ? <img src={avatar} alt={username} style={{ width: 40, height: 40, borderRadius: '50%', marginTop: 2 }} />
            : <Avatar color={color} letter={username[0].toUpperCase()} size={40} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {!continued && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color }}>{username}</span>
            {isBot && <BotBadge />}
            <span style={{ fontSize: 11, color: '#87898c' }}>{time}</span>
          </div>
        )}
        <div style={{ fontSize: 14, color: '#dbdee1', lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Discord embed ── */
export function DiscordEmbed({ color, title, description, fields, footer }: {
  color: string; title?: string; description?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: string;
}) {
  return (
    <div style={{
      borderLeft: `4px solid ${color}`,
      background: EMBED_BG,
      borderRadius: '0 4px 4px 0',
      padding: '8px 12px',
      marginTop: 4,
      maxWidth: 440,
    }}>
      {title && <div style={{ fontSize: 14, fontWeight: 600, color: '#f2f3f5', marginBottom: 4 }}>{title}</div>}
      {description && <div style={{ fontSize: 13, color: '#dbdee1', lineHeight: 1.5, marginBottom: fields ? 8 : 0 }}>{description}</div>}
      {fields && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {fields.map(f => (
            <div key={f.name} style={{ flex: f.inline ? '0 0 auto' : '1 1 100%' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f2f3f5', marginBottom: 2 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#dbdee1' }}>{f.value}</div>
            </div>
          ))}
        </div>
      )}
      {footer && <div style={{ fontSize: 11, color: '#87898c', marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>{footer}</div>}
    </div>
  );
}

/* ── Discord window shell ── */
export function DiscordWindow({ channel, children, minHeight = 240 }: { channel: string; children: React.ReactNode; minHeight?: number }) {
  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      background: CHANNEL_BG,
      fontFamily: '"gg sans", "Noto Sans", Whitney, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
      border: '1px solid rgba(255,255,255,0.06)',
      maxWidth: 520,
      /* Fixed height so animating messages never resize the section */
      minHeight,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Titlebar */}
      <div style={{ background: CHANNEL_BG, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 15, color: '#87898c' }}>#</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#f2f3f5' }}>{channel}</span>
      </div>
      {/* Messages — fixed height, no layout shift */}
      <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 0, flex: 1, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURE VISUALS
   ══════════════════════════════════════════════════════════════ */

/* 1. Scam Detection — real crypto scam image demo */
export function ScamDetectionMock() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(v => (v + 1) % 5), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <DiscordWindow channel="general" minHeight={360}>
      {/* User posts the scam image */}
      <DiscordMessage color="#ed4245" username="MrBeast_Official" time="Today at 3:14 PM">
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 13, color: '#dbdee1', marginBottom: 6 }}>
            🎁 I&apos;m giving away $3,200 in crypto! Register now to claim!
          </div>
          {/* Image with scan overlay */}
          <div style={{ position: 'relative', display: 'inline-block', borderRadius: 8, overflow: 'hidden', maxWidth: 260 }}>
            <img
              src="/scam-demo.jpg"
              alt="Scam image"
              style={{
                width: '100%', maxWidth: 260, display: 'block', borderRadius: 8,
                filter: step >= 1 ? 'brightness(0.55) saturate(0.4)' : 'none',
                transition: 'filter 0.4s ease',
              }}
            />
            {/* OCR scan line animation */}
            {step === 1 && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(to right, transparent, #1FA7BB, transparent)',
                animation: 'ocr-scan 1.1s ease-in-out forwards',
                boxShadow: '0 0 12px rgba(31,167,187,0.8)',
              }} />
            )}
            {/* Detected overlay */}
            {step >= 2 && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 8,
                border: '2px solid #ed4245',
                background: 'rgba(237,66,69,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.82)', borderRadius: 6, padding: '6px 12px',
                  fontSize: 11, fontWeight: 700, color: '#ed4245',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>🚨</span> CRYPTO SCAM DETECTED
                </div>
              </div>
            )}
          </div>
        </div>
      </DiscordMessage>

      {/* Layer bot response */}
      <div style={{ opacity: step >= 3 ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: step >= 3 ? 'auto' : 'none' }}>
        <DiscordMessage color={TEAL} username="Layer" isBot time="Today at 3:14 PM">
          <DiscordEmbed
            color="#ed4245"
            title="🚨 Crypto scam image detected & deleted"
            description='Image scan extracted: "giving away $3,200 in crypto" — matched fake celebrity giveaway pattern.'
            fields={[
              { name: 'User', value: 'MrBeast_Official', inline: true },
              { name: 'Action', value: 'Image deleted', inline: true },
              { name: 'Confidence', value: '97%', inline: true },
            ]}
            footer="Layer AI Image Detection"
          />
        </DiscordMessage>
      </div>

      {/* Normal reply */}
      <div style={{ opacity: step >= 4 ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: step >= 4 ? 'auto' : 'none' }}>
        <DiscordMessage color="#5865F2" username="Alex" time="Today at 3:15 PM">
          bro it scanned the image 😭 insane
        </DiscordMessage>
      </div>

      <style>{`
        @keyframes ocr-scan {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </DiscordWindow>
  );
}

/* 2. Ban Evasion */
export function BanEvasionMock() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 600);
    const i = setInterval(() => { setShow(false); setTimeout(() => setShow(true), 700); }, 4000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);

  return (
    <DiscordWindow channel="layer-logs" minHeight={320}>
      <DiscordMessage color="#ed4245" username="Layer" isBot time="Today at 2:09 PM">
        <DiscordEmbed
          color="#ed4245"
          title="🔁 Ban Evasion Detected"
          description="A previously banned user rejoined with a new account."
          fields={[
            { name: 'Original account', value: 'ToxicUser#1234 (banned Jan 12)', inline: false },
            { name: 'New account', value: 'NewUser#9876 (joined 2 min ago)', inline: false },
            { name: 'Match confidence', value: '98% — auto-banned', inline: false },
          ]}
          footer="Layer Ban Evasion Tracker"
        />
      </DiscordMessage>

      {/* Second message — opacity only, no layout shift */}
      <div style={{ opacity: show ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: show ? 'auto' : 'none' }}>
        <DiscordMessage color="#ed4245" username="Layer" isBot time="Today at 2:10 PM" continued>
          <DiscordEmbed
            color="#ed4245"
            title="🔨 User auto-banned"
            description="NewUser#9876 was automatically banned. No staff action required."
          />
        </DiscordMessage>
      </div>
    </DiscordWindow>
  );
}

/* 3. AI Ticket */
export function TicketMock() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(v => Math.min(v + 1, 2)), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <DiscordWindow channel="ticket-0042" minHeight={300}>
      {/* Message 1 — always visible */}
      <DiscordMessage color="#5865F2" username="Micha" time="Today at 4:22 PM">
        Hey I can&apos;t access the #announcements channel
      </DiscordMessage>

      {/* Message 2 — opacity transition */}
      <div style={{ opacity: idx >= 1 ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: idx >= 1 ? 'auto' : 'none' }}>
        <DiscordMessage color={TEAL} username="Layer" isBot time="Today at 4:22 PM">
          <DiscordEmbed
            color={TEAL}
            title="💡 Quick answer"
            description="Head to #roles and click 📢 Announcements to self-assign access."
            footer="Layer AI · Answered in 0.8s"
          />
        </DiscordMessage>
      </div>

      {/* System message — opacity transition */}
      <div style={{ opacity: idx >= 2 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#87898c', padding: '8px 16px' }}>
          — Staff joined · AI stepped back —
        </div>
      </div>
    </DiscordWindow>
  );
}

/* 4. Verification */
export function VerificationMock() {
  return (
    <DiscordWindow channel="verify" minHeight={240}>
      <DiscordMessage color={TEAL} username="Layer" isBot time="Today at 12:00 PM">
        <DiscordEmbed
          color={TEAL}
          title="✅ Verification required"
          description="Welcome to the server! Click the button below to verify you're human and get full access."
          footer="Zero data stored · No email required"
        />
        <div style={{ marginTop: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: TEAL, color: '#080808', fontWeight: 700, fontSize: 13, padding: '8px 18px', borderRadius: 4, cursor: 'default' }}>
            ✔ Verify me
          </span>
        </div>
      </DiscordMessage>
      <DiscordMessage color="#3ba55c" username="Layer" isBot time="Today at 12:01 PM" continued>
        <DiscordEmbed
          color="#3ba55c"
          title="✅ Verified"
          description="You're all set! You now have access to all channels."
        />
      </DiscordMessage>
    </DiscordWindow>
  );
}

/* 5. Dashboard — keep existing switch panel but styled as Discord window */
export function DashboardMock({ switches, toggleSwitch }: {
  switches: Record<string, boolean>;
  toggleSwitch: (k: string) => void;}) {
  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      background: '#1e1f22',
      border: '1px solid rgba(255,255,255,0.06)',
      fontFamily: '"gg sans", system-ui, sans-serif',
      maxWidth: 520,
    }}>
      {/* Fake browser chrome */}
      <div style={{ background: '#111214', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['#ed4245','#faa61a','#3ba55c'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        <div style={{ flex: 1, background: '#2b2d31', borderRadius: 4, padding: '4px 10px', marginLeft: 8 }}>
          <span style={{ fontSize: 11, color: '#87898c' }}>uselayer.de/dashboard</span>
        </div>
      </div>
      {/* Settings panel */}
      <div style={{ padding: '14px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#b5bac1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Moderation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { key: 'antiRaid',       label: 'Anti-Raid Shield',   desc: 'Auto-lock on join spike' },
            { key: 'antiScam',       label: 'AI Scam Scanner',    desc: 'OCR image detection' },
            { key: 'botQuarantine',  label: 'Bot Quarantine',     desc: 'Hold bots for approval' },
            { key: 'autoRestore',    label: 'Auto-Restore',       desc: 'Undo nuke in <60ms' },
            { key: 'ocrVision',      label: 'Ban Evasion',        desc: 'Pattern-match accounts' },
          ].map(item => (
            <div key={item.key}
              onClick={() => toggleSwitch(item.key)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 6, cursor: 'pointer',
                background: switches[item.key] ? 'rgba(31,167,187,0.07)' : 'transparent',
                transition: 'background 0.2s',
              }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#f2f3f5' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#87898c' }}>{item.desc}</div>
              </div>
              {/* Toggle */}
              <div style={{
                width: 40, height: 22, borderRadius: 999, flexShrink: 0,
                background: switches[item.key] ? TEAL : '#4e5058',
                position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff',
                  left: switches[item.key] ? 21 : 3, transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
