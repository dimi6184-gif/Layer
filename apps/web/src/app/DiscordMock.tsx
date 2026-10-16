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
export function DiscordWindow({ channel, children }: { channel: string; children: React.ReactNode }) {
  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      background: CHANNEL_BG,
      fontFamily: '"gg sans", "Noto Sans", Whitney, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
      border: '1px solid rgba(255,255,255,0.06)',
      maxWidth: 520,
    }}>
      {/* Titlebar */}
      <div style={{ background: CHANNEL_BG, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 15, color: '#87898c' }}>#</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#f2f3f5' }}>{channel}</span>
      </div>
      {/* Messages */}
      <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURE VISUALS
   ══════════════════════════════════════════════════════════════ */

/* 1. Scam Detection */
export function ScamDetectionMock() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(v => (v + 1) % 4), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <DiscordWindow channel="general">
      {/* Scam message */}
      <DiscordMessage color="#ed4245" username="FreeNitro99" time="Today at 3:14 PM">
        <span style={{ textDecoration: step >= 1 ? 'line-through' : 'none', color: step >= 1 ? '#87898c' : '#dbdee1', transition: 'all 0.3s' }}>
          🎁 FREE DISCORD NITRO — claim now: discord-gift.xyz/nitro
        </span>
      </DiscordMessage>

      {/* Layer bot response */}
      {step >= 2 && (
        <DiscordMessage color={TEAL} username="Layer" isBot time="Today at 3:14 PM">
          <DiscordEmbed
            color="#ed4245"
            title="🚨 Scam detected & deleted"
            description="Phishing link matched known scam pattern. Message removed in 0.3s."
            fields={[
              { name: 'User', value: 'FreeNitro99', inline: true },
              { name: 'Action', value: 'Message deleted', inline: true },
              { name: 'Confidence', value: '98%', inline: true },
            ]}
            footer="Layer AI Scam Detection"
          />
        </DiscordMessage>
      )}

      {/* Normal message after */}
      {step >= 3 && (
        <DiscordMessage color="#5865F2" username="Alex" time="Today at 3:15 PM">
          thanks for the protection 👍
        </DiscordMessage>
      )}
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
    <DiscordWindow channel="layer-logs">
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

      {show && (
        <DiscordMessage color="#ed4245" username="Layer" isBot time="Today at 2:10 PM" continued>
          <DiscordEmbed
            color="#ed4245"
            title="🔨 User auto-banned"
            description="NewUser#9876 was automatically banned. No staff action required."
          />
        </DiscordMessage>
      )}
    </DiscordWindow>
  );
}

/* 3. AI Ticket */
export function TicketMock() {
  const [idx, setIdx] = useState(0);
  const msgs = [
    { role: 'user',    color: '#5865F2', name: 'Micha',  text: "Hey I can't access the #announcements channel" },
    { role: 'bot',     color: TEAL,      name: 'Layer',  text: null }, // embed
    { role: 'system',  color: '',        name: '',       text: '— Staff joined · AI stepped back —' },
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(v => Math.min(v + 1, msgs.length - 1)), 1800);
    return () => clearInterval(t);
  }, [msgs.length]);

  return (
    <DiscordWindow channel="ticket-0042">
      {msgs.slice(0, idx + 1).map((m, i) => {
        if (m.role === 'system') return (
          <div key={i} style={{ textAlign: 'center', fontSize: 12, color: '#87898c', padding: '8px 16px' }}>{m.text}</div>
        );
        return (
          <DiscordMessage key={i} color={m.color} username={m.name} isBot={m.role === 'bot'} time="Today at 4:22 PM">
            {m.role === 'bot'
              ? <DiscordEmbed
                  color={TEAL}
                  title="💡 Quick answer"
                  description="Your role might be missing. Head to #roles and click the 📢 Announcements button to self-assign access."
                  footer="Layer AI · Reply generated in 0.8s"
                />
              : m.text
            }
          </DiscordMessage>
        );
      })}
    </DiscordWindow>
  );
}

/* 4. Verification */
export function VerificationMock() {
  return (
    <DiscordWindow channel="verify">
      <DiscordMessage color={TEAL} username="Layer" isBot time="Today at 12:00 PM">
        <DiscordEmbed
          color={TEAL}
          title="✅ Verification required"
          description="Welcome to the server! Click the button below to verify you're human and get full access."
          footer="Zero data stored · No email required"
        />
        {/* Fake button */}
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
