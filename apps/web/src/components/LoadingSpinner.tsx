'use client';

/* ─── LoadingSpinner — inline spinner, used in buttons etc ───── */
export function LoadingSpinner({ size = 'md', color = '#1FA7BB' }: { size?: 'sm' | 'md' | 'lg'; color?: string }) {
  const dim = { sm: 18, md: 28, lg: 42 }[size];
  return (
    <div style={{
      width: dim, height: dim,
      border: '2px solid rgba(255,255,255,0.08)',
      borderTopColor: color,
      borderRadius: '50%',
    }} className="animate-spin" />
  );
}

/* ─── LoadingPage — full-screen, same style as homepage intro ── */
export function LoadingPage() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 14,
    }}>
      <style>{`
        @keyframes lp-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lp-logo { animation: lp-up 0.4s ease 0s both; }
        .lp-sub  { animation: lp-up 0.4s ease 0.12s both; }
      `}</style>

      <div className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Layer" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        <span style={{ fontSize: 26, fontWeight: 900, color: '#f1f3f9', letterSpacing: '-0.04em' }}>Layer</span>
      </div>

      <p className="lp-sub" style={{
        fontSize: 11, color: 'rgba(255,255,255,0.28)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        Your server, finally under control.
      </p>
    </div>
  );
}

/* ─── LoadingCard — skeleton placeholder in dashboard cards ─── */
export function LoadingCard() {
  return (
    <div className="rounded-2xl p-6 animate-pulse" style={{
      background: '#121315',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="h-5 rounded-lg w-1/3 mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="space-y-2.5">
        {[1, 0.833, 0.666].map((w, i) => (
          <div key={i} className="h-3.5 rounded-md" style={{ width: `${w * 100}%`, background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    </div>
  );
}
