import Link from 'next/link';
import { signIn, auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginVisual from './LoginVisual';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ── LEFT — 50% animated dashboard preview ── */}
      <div className="login-left" style={{ display: 'none', flex: '0 0 50%', width: '50%' }}>
        <LoginVisual />
      </div>

      {/* ── RIGHT — 50% sign-in panel ── */}
      <div style={{
        flex: '0 0 100%', width: '100%',
        background: '#09090b',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }} className="login-right">
        {/* Top border accent */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />

        {/* Vertically centered content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 48px' }}>
          <div style={{ width: '100%', maxWidth: 320 }}>

            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f3f9', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Sign in
            </h1>
            <p style={{ fontSize: 14, color: '#4d5467', marginBottom: 32, lineHeight: 1.5 }}>
              Log in with your Discord account to continue
            </p>

            <form
              action={async () => {
                'use server';
                await signIn('discord', { redirectTo: '/dashboard' });
              }}
            >
              <button
                type="submit"
                className="login-discord-btn"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '12px 20px', borderRadius: 8,
                  background: '#5865F2', color: '#fff',
                  fontSize: 14, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  transition: 'opacity 0.15s, transform 0.1s',
                }}
              >
                <svg width="18" height="14" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
                Sign in
              </button>
            </form>

          </div>
        </div>

        {/* Bottom legal links with external-link icon */}
        <div style={{
          padding: '16px 48px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', gap: 20, alignItems: 'center',
        }}>
          {/* External link SVG icon */}
          {([['Privacy Policy', '/privacy'], ['Legal Notice', '/terms']] as const).map(([label, href]) => (
            <Link key={href} href={href} className="login-legal-link"
              style={{ fontSize: 12, color: '#2e3347', textDecoration: 'none', transition: 'color 0.15s', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {label}
              {/* tiny external arrow icon */}
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10L10 2M10 2H5M10 2V7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Responsive: on md+ show left at 50%, shrink right to 50% */}
      <style>{`
        @media (min-width: 768px) {
          .login-left  { display: flex !important; }
          .login-right { flex: 0 0 50% !important; width: 50% !important; }
        }
      `}</style>
    </div>
  );
}
