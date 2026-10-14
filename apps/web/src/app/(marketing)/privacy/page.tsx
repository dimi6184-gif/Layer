export default function PrivacyPage() {
  const sections = [
    {
      title: "Who We Are",
      body: "Layer is a Discord bot and moderation platform. For the purposes of data protection law, Layer is the data controller of your personal information. You can contact us at support@uselayer.de.",
    },
    {
      title: "What Data We Collect",
      body: "Layer is built with a zero-data philosophy. We collect as little as possible:",
      list: [
        "Discord User ID — to identify your account when you log into the dashboard via Discord OAuth",
        "Server configuration — settings you configure in the dashboard (moderation rules, welcome messages, etc.)",
        "Correspondence — any messages or enquiries you send to us",
        "Usage data — basic information about how you interact with the dashboard",
      ],
    },
    {
      title: "What We Do NOT Collect",
      body: "We explicitly do not collect or store:",
      list: [
        "Email addresses of your server members",
        "IP addresses of your server members",
        "Names, phone numbers, or physical addresses",
        "Any personal information from Discord verification flows — verification happens entirely within Discord",
      ],
    },
    {
      title: "How We Use Your Data",
      body: "We use your information to:",
      list: [
        "Provide you access to the Layer dashboard",
        "Store your server's configuration and settings",
        "Respond to your support enquiries",
        "Improve the platform and fix issues",
        "Comply with legal and regulatory obligations",
      ],
    },
    {
      title: "Legal Basis for Processing",
      body: "We process your personal data on the following grounds:",
      list: [
        "Contract — to provide the Layer service you have agreed to use",
        "Legitimate interests — to respond to enquiries and operate the platform",
        "Legal obligation — where we are required to process data by law",
      ],
    },
    {
      title: "How Long We Keep Your Data",
      body: "We retain your server configuration data for as long as your server is connected to Layer. If you remove Layer from your server and request deletion, all associated data is removed within 24 hours. Account data is retained until you request deletion.",
    },
    {
      title: "Sharing Your Data",
      body: "We do not sell your personal data. We may share data with trusted third-party providers who help us operate the platform:",
      list: [
        "Supabase — database hosting",
        "Vercel — web hosting",
        "Stripe — payment processing (for Pro subscriptions)",
        "Google — AI processing for scam detection (image analysis only, no personal data is sent)",
      ],
    },
    {
      title: "Your Rights",
      body: "Under applicable data protection law, you have the right to:",
      list: [
        "Access the data we hold about you",
        "Request correction of inaccurate data",
        "Request deletion of your data",
        "Withdraw your consent at any time",
        "Lodge a complaint with the relevant data protection authority",
      ],
      footer: "To exercise any of these rights, contact us at support@uselayer.de.",
    },
    {
      title: "Cookies",
      body: "The Layer dashboard uses essential cookies only — for authentication sessions. We do not use tracking or advertising cookies.",
    },
    {
      title: "Changes to This Policy",
      body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. Continued use of Layer constitutes acceptance of the revised policy.",
    },
    {
      title: "Contact",
      body: "If you have any questions about this policy or how we handle your data, contact us at support@uselayer.de.",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1.5" style={{ color: "#F5F4F5" }}>Privacy Policy</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Last updated: October 2026</p>
      </div>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <div key={s.title} className="pb-8" style={{ borderBottom: i < sections.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
            <h2 className="text-base font-semibold mb-2" style={{ color: "#F5F4F5" }}>{s.title}</h2>
            <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.55)" }}>{s.body}</p>
            {s.list && (
              <ul className="space-y-1.5 mt-3">
                {s.list.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <span className="flex-shrink-0 mt-2.5 w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {s.footer && (
              <p className="text-sm leading-7 mt-3" style={{ color: "rgba(255,255,255,0.55)" }}>{s.footer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
