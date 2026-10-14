export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      body: "By adding Layer to your Discord server or using the Layer dashboard, you agree to be bound by these Terms of Service. If you do not agree, please remove the bot from your server and stop using the platform.",
    },
    {
      title: "Use of the Platform",
      body: "Layer is a Discord bot and moderation platform designed for server owners and administrators. You agree to use Layer only for lawful purposes and in accordance with these terms.",
      list: [
        "Use Layer in any way that violates applicable laws or Discord's Terms of Service",
        "Attempt to gain unauthorized access to any part of the Layer platform or dashboard",
        "Use Layer to target, harass, or harm members of your server or other communities",
        "Resell or redistribute access to Layer's Pro features without our written consent",
        "Use Layer's AI features to generate harmful, misleading, or illegal content",
      ],
      listLabel: "You must not:",
    },
    {
      title: "Account Responsibility",
      body: "You are responsible for maintaining the confidentiality of your dashboard login credentials. You agree to notify us immediately at support@uselayer.de if you suspect any unauthorized access to your account. Layer uses Discord OAuth for authentication — we never store your password.",
    },
    {
      title: "Zero Data Policy",
      body: "Layer does not collect or store email addresses, IP addresses, or personal information from your server members. Verification happens entirely within Discord. We only store your Discord User ID to identify your account. For full details, see our Privacy Policy.",
    },
    {
      title: "Intellectual Property",
      body: "All content, design, and technology on the Layer platform is owned by or licensed to Layer. You may not copy, reproduce, or distribute any part of the platform without our prior written permission. The server configurations, custom settings, and automations you create using Layer remain yours — we do not claim ownership over how you configure or use the bot.",
    },
    {
      title: "Subscriptions and Payments",
      body: "Layer offers a free plan and a Pro plan. By subscribing to Pro, you agree to pay the applicable fees. Fees are billed in advance and are non-refundable except where required by law. We reserve the right to change our pricing at any time, with reasonable notice provided to existing subscribers.",
    },
    {
      title: "Cancellation",
      body: "You may cancel your Pro subscription at any time from your billing settings. Cancellation takes effect at the end of your current billing period. You will retain access to Pro features until that date, after which your server automatically returns to the Free plan.",
    },
    {
      title: "Limitation of Liability",
      body: "To the fullest extent permitted by law, Layer shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform — including but not limited to accidental moderation actions, data loss, or service downtime. Our total liability shall not exceed the amount you paid to us in the twelve months preceding the claim.",
    },
    {
      title: "Disclaimer of Warranties",
      body: "Layer is provided on an \"as is\" and \"as available\" basis. We do not guarantee that the platform will be error-free, uninterrupted, or that automated moderation actions will catch every violation or avoid every false positive.",
    },
    {
      title: "Changes to These Terms",
      body: "We may update these Terms of Service from time to time. Any changes will be posted on this page with an updated date. Continued use of Layer after changes are posted constitutes your acceptance of the revised terms.",
    },
    {
      title: "Governing Law",
      body: "These terms are governed by and construed in accordance with applicable law. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the relevant courts.",
    },
    {
      title: "Contact",
      body: "If you have any questions about these terms, please contact us at support@uselayer.de.",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1.5" style={{ color: "#F5F4F5" }}>Terms of Service</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Last updated: October 2026</p>
      </div>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <div key={s.title} className="pb-8" style={{ borderBottom: i < sections.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
            <h2 className="text-base font-semibold mb-2" style={{ color: "#F5F4F5" }}>{s.title}</h2>
            <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.55)" }}>{s.body}</p>
            {s.list && (
              <>
                {s.listLabel && <p className="text-sm mt-3 mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{s.listLabel}</p>}
                <ul className="space-y-1.5 mt-2">
                  {s.list.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span className="flex-shrink-0 mt-2.5 w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
