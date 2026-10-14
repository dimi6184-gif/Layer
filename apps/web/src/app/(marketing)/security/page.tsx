import { Check, X, Shield, ShieldCheck, Lock, Database, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  const sections = [
    {
      id: "overview",
      title: "Overview",
    },
    {
      id: "data",
      title: "Data Collection",
    },
    {
      id: "how-it-works",
      title: "How It Works",
    },
    {
      id: "comparison",
      title: "vs Double Counter",
    },
  ];

  return (
    <div className="space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1.5" style={{ color: "#F5F4F5" }}>
          Security Whitepaper
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          How Layer protects your server members' privacy.
        </p>
      </div>

      {/* Alert banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#F97316" }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "#F5F4F5" }}>Double Counter breach — 28 million users exposed</p>
          <p className="text-xs mt-0.5 leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>
            In 2023, Double Counter's external verification website was breached, exposing IP addresses,
            emails, and browser fingerprints of 28M Discord users. Layer was built to make this impossible.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Overview */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold" style={{ color: "#F5F4F5" }}>Overview</h2>
        <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.55)" }}>
          Layer's verification system never routes users through an external website.
          Verification happens entirely inside Discord via Discord's native OAuth popup.
          Because users never visit our servers, we physically cannot log their IP address,
          browser fingerprint, or location — even if we wanted to.
        </p>
        <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.55)" }}>
          The only data we receive from Discord is a User ID and guild membership status —
          the minimum required to assign a verified role.
        </p>
      </div>

      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Data collection */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold" style={{ color: "#F5F4F5" }}>Data Collection</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Collect */}
          <div className="rounded-xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              What we collect
            </p>
            {[
              { label: "Discord User ID", note: "Required by Discord's API to assign roles" },
              { label: "Server configuration", note: "Settings you configure in the dashboard" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1FA7BB" }} />
                <div>
                  <p className="text-sm" style={{ color: "#F5F4F5" }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Never collect */}
          <div className="rounded-xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              What we never collect
            </p>
            {[
              "Email addresses",
              "IP addresses",
              "Browser fingerprints",
              "Location data",
              "Message content",
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <X className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(239,68,68,0.7)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }} />

      {/* How it works */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold" style={{ color: "#F5F4F5" }}>How Layer verification works</h2>
        <div className="space-y-0">
          {[
            { step: "01", text: "Member clicks the Verify button inside Discord." },
            { step: "02", text: "Discord's native OAuth popup appears — inside the Discord app, not our website." },
            { step: "03", text: "Discord sends us only the User ID and guild membership." },
            { step: "04", text: "We assign the verified role via the Discord API." },
            { step: "05", text: "Done. No IP, no email, no fingerprint logged — ever." },
          ].map((item, i) => (
            <div
              key={item.step}
              className="flex items-start gap-5 py-4"
              style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <span className="text-xs font-mono flex-shrink-0 mt-0.5 w-6" style={{ color: "rgba(255,255,255,0.2)" }}>
                {item.step}
              </span>
              <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.6)" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Comparison */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold" style={{ color: "#F5F4F5" }}>Layer vs Double Counter</h2>

        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Header */}
          <div className="grid grid-cols-3 px-5 py-3" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Feature</span>
            <span className="text-xs text-center" style={{ color: "rgba(239,68,68,0.7)" }}>Double Counter</span>
            <span className="text-xs text-center" style={{ color: "#1FA7BB" }}>Layer</span>
          </div>
          {[
            ["Verification location", "External website", "Inside Discord"],
            ["IP address logged", "Yes", "No"],
            ["Email collected", "Yes", "No"],
            ["Browser fingerprint", "Yes", "No"],
            ["External data breach possible", "Yes (happened)", "No"],
            ["GDPR compliant", "Questionable", "Yes"],
            ["Data stored", "Extensive", "User ID only"],
          ].map(([feat, bad, good], i) => (
            <div
              key={String(feat)}
              className="grid grid-cols-3 px-5 py-3.5 items-center"
              style={{ borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{feat}</span>
              <div className="flex items-center justify-center gap-1.5">
                <X className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(239,68,68,0.6)" }} />
                <span className="text-xs" style={{ color: "rgba(239,68,68,0.6)" }}>{bad}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Check className="w-3 h-3 flex-shrink-0" style={{ color: "#1FA7BB" }} />
                <span className="text-xs" style={{ color: "#1FA7BB" }}>{good}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Key principle */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold" style={{ color: "#F5F4F5" }}>The core principle</h2>
        <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.55)" }}>
          The only way to guarantee you can't collect data is to never have the opportunity to collect it.
          By keeping verification inside Discord, we remove ourselves from the equation entirely.
          No external server means no external breach vector.
        </p>
        <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.55)" }}>
          If you have questions about our security practices, contact us at{" "}
          <a href="mailto:support@uselayer.de" className="transition-colors hover:text-white" style={{ color: "#1FA7BB" }}>
            support@uselayer.de
          </a>
        </p>
      </div>

      {/* CTA */}
      <div className="pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
          style={{ color: "#1FA7BB" }}
        >
          Add Layer to your server →
        </Link>
      </div>

    </div>
  );
}
