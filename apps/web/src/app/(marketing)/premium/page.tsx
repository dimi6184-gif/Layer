import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  const free = [
    "Up to 1,000 members",
    "Basic auto-moderation",
    "Ticket system",
    "Leveling & XP",
    "Welcome messages",
    "Verification system",
    "Music player",
    "10 AI scans per day",
    "Community support",
  ];

  const pro = [
    "Up to 10,000 members",
    "Unlimited AI scam detection",
    "Ban evasion tracking",
    "AI ticket routing",
    "Advanced auto-moderation",
    "Custom verification flows",
    "Advanced analytics dashboard",
    "Ghost member cleaner",
    "Avatar history tracker",
    "Impersonation detection",
    "Priority support (24h)",
    "Remove 'Powered by Layer'",
  ];

  const notInFree = [
    "Ban evasion tracking",
    "AI ticket routing",
    "Advanced analytics",
    "Ghost member cleaner",
    "Avatar history tracker",
    "Impersonation detection",
    "Priority support",
  ];

  return (
    <div className="space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1.5" style={{ color: "#F5F4F5" }}>
          Plans & Pricing
        </h1>
        <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          Layer is completely free during early access. Every feature, every server, no limits.<br />
          We may introduce Pro in the future — early servers will always be taken care of.
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-2 gap-5">

        <div className="rounded-2xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Free</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-semibold" style={{ color: "#F5F4F5" }}>$0</span>
              <span className="text-sm mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>/month</span>
            </div>
            <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.4)" }}>Perfect for small communities getting started.</p>
          </div>
          <Link
            href="/dashboard"
            className="block w-full text-center py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            Get started
          </Link>
          <ul className="space-y-2.5">
            {free.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1FA7BB" }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="rounded-2xl p-6 space-y-5 relative" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(31,167,187,0.25)" }}>
          <div className="absolute -top-3 left-6">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: "#1FA7BB", color: "#080808" }}>
              Coming Soon
            </span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#1FA7BB" }}>Pro</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-semibold" style={{ color: "#F5F4F5" }}>$4.99</span>
              <span className="text-sm mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>/month</span>
            </div>
            <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.4)" }}>Unlock AI superpowers for serious servers.</p>
          </div>
          <div
            className="block w-full text-center py-2.5 rounded-xl text-sm font-medium opacity-40 cursor-not-allowed"
            style={{ background: "#1FA7BB", color: "#080808" }}
          >
            Start Pro
          </div>
          <ul className="space-y-2.5">
            {pro.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: notInFree.includes(f) ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)" }}>
                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1FA7BB" }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comparison table */}
      <div>
        <h2 className="text-xl font-semibold mb-5" style={{ color: "#F5F4F5" }}>Feature comparison</h2>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Header */}
          <div className="grid grid-cols-3 px-5 py-3" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-xs font-semibold" style={{ color: "#A8A9A2" }}>Feature</span>
            <span className="text-xs font-semibold text-center" style={{ color: "#A8A9A2" }}>Free</span>
            <span className="text-xs font-semibold text-center" style={{ color: "#1FA7BB" }}>Pro</span>
          </div>
          {[
            ["Members", "1,000", "10,000"],
            ["AI Scam Detection", "10/day", "Unlimited"],
            ["Ban Evasion Tracking", false, true],
            ["AI Ticket Routing", false, true],
            ["Auto-Moderation", true, true],
            ["Leveling & XP", true, true],
            ["Music Player", true, true],
            ["Verification System", true, true],
            ["Advanced Analytics", false, true],
            ["Ghost Member Cleaner", false, true],
            ["Priority Support", false, true],
          ].map(([feat, f, p], i) => (
            <div
              key={String(feat)}
              className="grid grid-cols-3 px-5 py-3 items-center"
              style={{ borderBottom: i < 10 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
            >
              <span className="text-sm" style={{ color: "#F5F4F5" }}>{feat}</span>
              <div className="flex justify-center">
                {typeof f === "boolean"
                  ? f ? <Check className="w-4 h-4" style={{ color: "#1FA7BB" }} /> : <X className="w-4 h-4" style={{ color: "#A8A9A2" }} />
                  : <span className="text-xs" style={{ color: "#A8A9A2" }}>{f}</span>
                }
              </div>
              <div className="flex justify-center">
                {typeof p === "boolean"
                  ? p ? <Check className="w-4 h-4" style={{ color: "#1FA7BB" }} /> : <X className="w-4 h-4" style={{ color: "#A8A9A2" }} />
                  : <span className="text-xs font-semibold" style={{ color: "#1FA7BB" }}>{p}</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-semibold mb-5" style={{ color: "#F5F4F5" }}>Common questions</h2>
        <div className="space-y-4">
          {[
            ["Is Layer really free?", "Yes, completely. Every feature is free during our early access period. We may introduce Pro in the future, but early servers will always be taken care of."],
            ["What happens when I exceed the member limit?", "We notify you and give you 7 days to upgrade. No features are disabled during the grace period."],
            ["Can I cancel Pro anytime?", "Yes. Cancel from your billing settings in one click. No contracts, no questions. Rolls back to Free at end of billing period."],
            ["Is payment secure?", "Yes, powered by Stripe. We never store your card details."],
          ].map(([q, a]) => (
            <div key={String(q)} className="p-4 rounded-xl" style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-sm font-semibold mb-1.5" style={{ color: "#F5F4F5" }}>{q}</p>
              <p className="text-sm" style={{ color: "#A8A9A2" }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
