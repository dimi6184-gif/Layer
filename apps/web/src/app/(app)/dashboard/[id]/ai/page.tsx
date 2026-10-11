import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";
import { ModuleSwitch } from "@/components/ModuleSwitch";
import { AIPersonalityForm } from "@/components/AIPersonalityForm";
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function AIModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 🔒 SECURITY: Verify user has access to this guild
  await ensureServerAccess(id);

  const guild = await db.guild.findUnique({
    where: { discordId: id }
  });

  if (!guild) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/${id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: "#A8A9A2" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Bot className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Layer AI
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>Configure the artificial intelligence settings for your server.</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Toggle Panel */}
        <div
          className="p-5 rounded-2xl flex items-center justify-between"
          style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Enable Layer AI</h3>
            <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>Allows the bot to respond to natural language and the /ask command.</p>
          </div>
          <ModuleSwitch discordId={id} module="aiEnabled" initialEnabled={guild.aiEnabled} />
        </div>

        {/* Personality Editor */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <AIPersonalityForm discordId={id} initialPersonality={guild.personality} />
        </div>
      </div>
    </div>
  );
}
