export default function RefundsPage() {
  const sections = [
    {
      title: "Overview",
      body: "This Refund Policy outlines the conditions under which Layer will issue refunds for Pro subscription payments. We want to be fair and transparent about how refunds work.",
    },
    {
      title: "Free Plan",
      body: "Layer's free plan has no associated charges. No payment, no refund needed. You can stop using Layer at any time without any financial implications.",
    },
    {
      title: "Pro Plan — Monthly Billing",
      body: "Monthly Pro subscriptions are non-refundable once charged. If you cancel a monthly subscription, you will retain Pro access until the end of the current billing period. No partial refunds are issued for unused days within a billing cycle.",
    },
    {
      title: "Pro Plan — Annual Billing",
      body: "For annual subscriptions, we offer a 14-day refund window from the date of purchase. If you are unsatisfied within the first 14 days, contact us at support@uselayer.de and we will process a full refund. After 14 days, annual subscriptions are non-refundable.",
    },
    {
      title: "Exceptions",
      body: "We may issue refunds outside of the above policy in the following circumstances:",
      list: [
        "Extended service outages (more than 72 hours of continuous downtime directly caused by Layer)",
        "Duplicate charges due to a billing error on our side",
        "Charges made after a confirmed cancellation request",
        "Cases where applicable consumer protection law requires a refund",
      ],
    },
    {
      title: "How to Request a Refund",
      body: "To request a refund, contact us at support@uselayer.de with the following information:",
      list: [
        "Your Discord username or User ID",
        "The email address associated with your Stripe payment",
        "The date of purchase",
        "The reason for your refund request",
      ],
      footer: "We aim to respond to all refund requests within 2 business days.",
    },
    {
      title: "Chargebacks",
      body: "If you initiate a chargeback with your bank or card provider without first contacting us, we reserve the right to suspend your Layer Pro access immediately. We encourage you to contact us first — we are committed to resolving any issues fairly and promptly.",
    },
    {
      title: "Changes to This Policy",
      body: "We may update this Refund Policy from time to time. Changes will be posted on this page with an updated date. Continued use of Layer Pro after changes are posted constitutes your acceptance of the revised policy.",
    },
    {
      title: "Contact",
      body: "For any refund-related questions, please contact us at support@uselayer.de.",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1.5" style={{ color: "#F5F4F5" }}>Refund Policy</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Last updated: October 2026</p>
      </div>

      {/* Quick summary */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          ["Free Plan", "No charges, no refunds needed."],
          ["Monthly Pro", "Non-refundable after charge."],
          ["Annual Pro", "14-day refund window."],
        ].map(([label, desc]) => (
          <div key={String(label)} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#F5F4F5" }}>{label}</p>
            <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
          </div>
        ))}
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
