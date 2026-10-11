import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Redirects: catch Framer internal SPA routes and send to real Next.js pages
  async redirects() {
    return [
      // Short links for Add to Discord / Bot Invite
      {
        source: '/invite',
        destination: 'https://discord.com/oauth2/authorize?client_id=1528870506881875988&permissions=8&scope=bot%20applications.commands',
        permanent: false,
      },
      {
        source: '/add',
        destination: 'https://discord.com/oauth2/authorize?client_id=1528870506881875988&permissions=8&scope=bot%20applications.commands',
        permanent: false,
      },
      // Framer /sign-in → our Discord login
      { source: '/sign-in', destination: '/login', permanent: true },
      // Framer /sign-up → our Discord login (we only have Discord OAuth)
      { source: '/sign-up', destination: '/login', permanent: true },
      // Framer /otp (OTP code page) → our Discord login
      { source: '/otp', destination: '/login', permanent: true },
      // Framer /account → our dashboard
      { source: '/account', destination: '/dashboard', permanent: true },
      // Framer /contact → bot invite
      { source: '/contact', destination: '/invite', permanent: true },
      // Framer /legal/* → our real legal pages
      { source: '/legal/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/legal/terms-of-service', destination: '/terms', permanent: true },
      { source: '/legal/:slug', destination: '/', permanent: false },
    ];
  },
  
  // Image optimization - Updated to remotePatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.twitchcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Content-Security-Policy',
            value: isDev 
              ? [
                  // Development: More permissive for HMR
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: https: blob:",
                  "font-src 'self' data:",
                  "connect-src 'self' https://cdn.discordapp.com https://*.supabase.co wss://*.supabase.co ws://localhost:* http://localhost:* https://*.ingest.us.sentry.io",
                  "frame-ancestors 'none'",
                  "base-uri 'self'",
                  "form-action 'self'"
                ].join('; ')
              : [
                  // Production CSP (supporting Framer animations, fonts & Sentry)
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://framer.com",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "img-src 'self' data: https: blob:",
                  "font-src 'self' data: https://fonts.gstatic.com",
                  "connect-src 'self' https://cdn.discordapp.com https://*.supabase.co wss://*.supabase.co https://*.ingest.us.sentry.io https://fonts.gstatic.com",
                  "frame-ancestors 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "upgrade-insecure-requests"
                ].join('; ')
          }
        ]
      }
    ];
  },
};

export default nextConfig;
