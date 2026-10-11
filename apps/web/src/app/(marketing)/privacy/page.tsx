export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-24 min-h-screen animate-fade-up bg-white">
      <div className="border-b border-gray-200 pb-10 mb-10">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 text-sm font-light">Last updated: May 31, 2026</p>
      </div>

      <div className="flex flex-col gap-12">
        <Section
          title="1. Information We Collect"
          body="We only collect information that is strictly necessary for the bot to function and to provide you with the best possible experience."
        >
          <ul className="mt-4 flex flex-col gap-3">
            <li className="flex gap-3 text-gray-700 font-light text-base leading-relaxed">
              <span className="text-blue-600 mt-1">—</span>
              <span><strong className="text-gray-900 font-bold">Discord IDs:</strong> We store User IDs, Server IDs, and Channel IDs to link settings, levels, and moderation logs correctly.</span>
            </li>
            <li className="flex gap-3 text-gray-700 font-light text-base leading-relaxed">
              <span className="text-blue-600 mt-1">—</span>
              <span><strong className="text-gray-900 font-bold">Message Content:</strong> Messages are processed temporarily in memory for auto-moderation. We do not permanently store your message history.</span>
            </li>
            <li className="flex gap-3 text-gray-700 font-light text-base leading-relaxed">
              <span className="text-blue-600 mt-1">—</span>
              <span><strong className="text-gray-900 font-bold">Dashboard Settings:</strong> Any configuration made through our web dashboard is securely stored in our database.</span>
            </li>
          </ul>
        </Section>

        <Section
          title="2. How We Use Your Information"
          body="The information we collect is exclusively used to provide you with moderation, leveling, and music features. We do not sell, rent, or share your data with third parties for marketing purposes under any circumstances."
        />

        <Section
          title="3. Data Retention & Deletion"
          body="Temporary data is deleted automatically. You have the right to request deletion of all your server and user data at any time. Contact our support team and your data will be wiped from our servers within 30 days."
        />

        <Section
          title="4. Data Security"
          body="We implement industry-standard security measures, including encryption at rest and in transit, to protect your data from unauthorized access, alteration, or destruction."
        />

        <Section
          title="5. Contact"
          body="If you have any questions about this Privacy Policy or how we handle your data, please reach out to us on our official Discord support server."
        />
      </div>
    </div>
  );
}

function Section({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-16 border-b border-gray-200 pb-12">
      <h2 className="text-lg font-bold text-gray-900 w-64 shrink-0 leading-tight">{title}</h2>
      <div className="flex-1">
        <p className="text-gray-700 font-light text-base leading-relaxed">{body}</p>
        {children}
      </div>
    </div>
  );
}
