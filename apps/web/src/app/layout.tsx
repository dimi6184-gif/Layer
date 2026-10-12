import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://uselayer.de'),
  title: {
    default: "Layer — AI Discord Bot | Scam Detection, Moderation & More",
    template: "%s | Layer",
  },
  description: "Layer protects your Discord server with AI scam detection, ban evasion tracking, smart ticket routing, leveling, music, and zero data storage. Free to start.",
  keywords: [
    "discord bot",
    "discord moderation bot",
    "discord ai bot",
    "discord anti scam bot",
    "discord ban evasion",
    "discord ticket bot",
    "discord leveling bot",
    "discord music bot",
    "discord verification bot",
    "discord security bot",
    "free discord bot",
    "discord server protection",
    "discord scam protection",
    "discord ghost member cleaner",
    "discord auto moderation",
    "best discord bot 2026",
  ],
  authors: [{ name: "Layer Team", url: "https://uselayer.de" }],
  creator: "Layer",
  publisher: "Layer",
  category: "Technology",
  classification: "Discord Bot, AI Moderation, Server Security",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://uselayer.de",
    title: "Layer — AI Discord Bot | Scam Detection & Moderation",
    description: "Layer protects your Discord server with AI scam detection, ban evasion tracking, smart ticket routing, and zero data storage. Free to start.",
    siteName: "Layer",
    images: [
      {
        url: "https://uselayer.de/logo.png",
        width: 1200,
        height: 630,
        alt: "Layer — AI Discord Bot",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Layer — AI Discord Bot",
    description: "Protect your Discord server with AI scam detection, ban evasion tracking, and smart moderation. Free to start.",
    images: ["https://uselayer.de/logo.png"],
    creator: "@uselayerbot",
    site: "@uselayerbot",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://uselayer.de",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // ── Organization ──────────────────────────────────────────────
      {
        "@type": "Organization",
        "@id": "https://uselayer.de/#org",
        "name": "Layer",
        "url": "https://uselayer.de/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://uselayer.de/logo.png",
          "width": 512,
          "height": 512
        },
        "description": "Layer is an AI-powered Discord bot offering scam detection, ban evasion tracking, smart ticket routing, leveling, music, and zero data storage.",
        "email": "support@uselayer.de",
        "foundingDate": "2026",
        "slogan": "Your Discord server, finally under control.",
        "sameAs": [
          "https://uselayer.de"
        ]
      },

      // ── WebSite ───────────────────────────────────────────────────
      {
        "@type": "WebSite",
        "@id": "https://uselayer.de/#website",
        "url": "https://uselayer.de/",
        "name": "Layer — AI Discord Bot",
        "description": "Layer protects your Discord server with AI scam detection, ban evasion tracking, AI ticket routing, and a full moderation suite. Free to start.",
        "inLanguage": "en",
        "publisher": { "@id": "https://uselayer.de/#org" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://uselayer.de/?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },

      // ── WebPage (Homepage) ────────────────────────────────────────
      {
        "@type": "WebPage",
        "@id": "https://uselayer.de/#webpage",
        "url": "https://uselayer.de/",
        "name": "Layer — AI Discord Bot | Scam Detection, Moderation & More",
        "description": "Layer protects your Discord server with AI scam detection, ban evasion tracking, smart ticket routing, and zero data storage. Free to start.",
        "isPartOf": { "@id": "https://uselayer.de/#website" },
        "about": { "@id": "https://uselayer.de/#app" },
        "publisher": { "@id": "https://uselayer.de/#org" },
        "inLanguage": "en",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://uselayer.de/"
            }
          ]
        }
      },

      // ── SoftwareApplication ───────────────────────────────────────
      {
        "@type": "SoftwareApplication",
        "@id": "https://uselayer.de/#app",
        "name": "Layer Discord Bot",
        "alternateName": ["Layer Bot", "Layer Moderation Bot"],
        "description": "AI-powered Discord bot with real-time scam detection (OCR + pattern matching), ban evasion tracking, smart ticket routing, leveling with streaks and achievements, music playback, and a zero data collection policy.",
        "url": "https://uselayer.de/",
        "image": "https://uselayer.de/logo.png",
        "applicationCategory": "UtilitiesApplication",
        "applicationSubCategory": "Discord Bot",
        "operatingSystem": "Discord",
        "inLanguage": "en",
        "featureList": [
          "AI Scam Detection with OCR image scanning",
          "Ban Evasion Tracking",
          "AI Ticket Routing",
          "Auto-Moderation (spam, caps, links, invites)",
          "Leveling System with XP, streaks, achievements",
          "Music Player (YouTube)",
          "Verification System (CAPTCHA)",
          "Welcome & Leave Messages",
          "Giveaway Manager",
          "Poll System",
          "Zero Data Collection Policy"
        ],
        "brand": {
          "@type": "Brand",
          "name": "Layer",
          "logo": "https://uselayer.de/logo.png"
        },
        "creator": { "@id": "https://uselayer.de/#org" },
        "publisher": { "@id": "https://uselayer.de/#org" },
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": "https://uselayer.de/",
            "description": "Free plan with basic moderation, leveling, tickets, and verification for up to 1,000 members."
          },
          {
            "@type": "Offer",
            "name": "Pro Plan",
            "price": "4.99",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": "https://uselayer.de/",
            "description": "Pro plan with unlimited AI scam detection, ban evasion tracking, advanced analytics, and priority support."
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "bestRating": "5",
          "ratingCount": "1"
        }
      },

      // ── FAQPage ───────────────────────────────────────────────────
      {
        "@type": "FAQPage",
        "@id": "https://uselayer.de/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How quickly can I get started with Layer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most servers are up and running in under 2 minutes. Add Layer to Discord, run /setup, and your server is instantly protected. No technical knowledge needed."
            }
          },
          {
            "@type": "Question",
            "name": "How does Layer's scam detection work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Layer scans every image and message in real time. It reads text inside images, checks for phishing links, fake giveaways, and fraud patterns — deleted automatically before any member sees it."
            }
          },
          {
            "@type": "Question",
            "name": "Does Layer store my Discord members' data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Layer collects zero emails, zero IPs, and zero personal information. Everything stays inside Discord — nothing is written to our servers."
            }
          },
          {
            "@type": "Question",
            "name": "What is ban evasion tracking?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When a banned user creates a new account and tries to rejoin, Layer detects them through behavioral and network pattern matching and bans the new account automatically."
            }
          },
          {
            "@type": "Question",
            "name": "Is Layer free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Layer offers a generous free plan for up to 1,000 members including moderation, tickets, leveling, and verification. Pro unlocks unlimited AI scans, ban evasion tracking, and advanced analytics for €4.99/month."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
