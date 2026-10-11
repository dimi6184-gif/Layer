export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-24 min-h-screen animate-fade-up bg-white">
      <div className="border-b border-gray-200 pb-10 mb-10">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-gray-900">Terms of Service</h1>
        <p className="text-gray-600 text-sm font-light">Last updated: May 31, 2026</p>
      </div>

      <div className="flex flex-col gap-12">
        <Section
          title="1. Acceptance of Terms"
          body="By accessing or using Layer, you confirm that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our bot or website."
        />

        <Section
          title="2. Description of Service"
          body="Layer is a Discord bot that provides server management, moderation, leveling, and music features. We reserve the right to modify, suspend, or discontinue the service at any time without prior notice."
        />

        <Section
          title="3. User Responsibilities"
          body="You are responsible for any activity that occurs on your server when using Layer. You agree not to use Layer for any illegal or unauthorized purpose, and must not attempt to abuse, hack, or exploit the bot's systems."
        />

        <Section
          title="4. Premium Subscriptions"
          body="Some features of Layer are only accessible via a Premium subscription. Payments are non-refundable unless otherwise required by applicable law. We reserve the right to change our pricing or features at any time."
        />

        <Section
          title="5. Limitation of Liability"
          body='Layer and its developers are not liable for any damages, data loss, or server disruptions that may occur as a result of using the bot. The service is provided "as is" without any warranties of any kind.'
        />

        <Section
          title="6. Governing Law"
          body="These terms are governed by applicable law. By using Layer, you consent to the exclusive jurisdiction of the applicable courts for the resolution of any disputes."
        />
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-16 border-b border-gray-200 pb-12">
      <h2 className="text-lg font-bold text-gray-900 w-64 shrink-0 leading-tight">{title}</h2>
      <p className="flex-1 text-gray-700 font-light text-base leading-relaxed">{body}</p>
    </div>
  );
}
