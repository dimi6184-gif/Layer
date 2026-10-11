'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle navigation start
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setProgress(30);
    };

    // Listen for clicks on internal links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const targetUrl = new URL(link.href);
        if (targetUrl.pathname !== pathname) {
          handleStart();
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  // Handle navigation complete
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Simulate progress while loading
  useEffect(() => {
    if (loading && progress < 90) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, progress]);

  if (!loading && progress === 0) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`,
            background: "linear-gradient(to right, #1FA7BB, #174F49, #1FA7BB)",
            boxShadow: "0 0 8px rgba(31,167,187,0.6)",
            transition: progress === 100 ? 'width 0.2s ease-out' : 'width 0.3s ease-out'
          }}
        />
      </div>
      {loading && (
        <div className="fixed inset-0 z-[99] bg-black/20 backdrop-blur-[2px] pointer-events-none transition-opacity duration-200" />
      )}
    </>
  );
}
