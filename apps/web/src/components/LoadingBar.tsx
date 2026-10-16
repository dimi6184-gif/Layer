'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const DASHBOARD_ROUTES = ['/dashboard', '/login', '/invite', '/api/'];

function isDashboardRoute(path: string) {
  return DASHBOARD_ROUTES.some(r => path.startsWith(r));
}

export function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link?.href) return;

      try {
        const targetUrl = new URL(link.href);
        // Only show loading bar when navigating TO a dashboard route
        if (
          targetUrl.origin === window.location.origin &&
          targetUrl.pathname !== pathname &&
          isDashboardRoute(targetUrl.pathname)
        ) {
          setLoading(true);
          setProgress(30);
        }
      } catch {
        // ignore malformed URLs
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  // Complete on navigation
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const t = setTimeout(() => { setLoading(false); setProgress(0); }, 200);
      return () => clearTimeout(t);
    }
  }, [pathname, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Simulate progress ticks
  useEffect(() => {
    if (loading && progress < 90) {
      const t = setTimeout(() => setProgress(p => Math.min(p + 10, 90)), 300);
      return () => clearTimeout(t);
    }
  }, [loading, progress]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent pointer-events-none">
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(to right, #1FA7BB, #174F49, #1FA7BB)',
          boxShadow: '0 0 8px rgba(31,167,187,0.6)',
          transition: progress === 100 ? 'width 0.2s ease-out' : 'width 0.3s ease-out',
        }}
      />
    </div>
  );
}
