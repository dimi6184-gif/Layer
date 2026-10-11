import { db } from "@nexus/db";
import { ensureServerAccess } from "@/lib/ensure-access";
import { AntiScamSettings } from "@/components/AntiScamSettings";
import { Shield } from "lucide-react";

export default async function AntiScamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guildId } = await params;
  await ensureServerAccess(guildId);

  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: {
      antiScamEnabled: true,
      scamSensitivity: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <Shield className="w-5 h-5" style={{ color: "#1FA7BB" }} /> Anti-Scam Protection
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A8A9A2" }}>
            AI-powered scam detection with OCR image scanning and link analysis
          </p>
        </div>
      </div>

      <AntiScamSettings
        guildId={guildId}
        settings={{
          enabled: guild?.antiScamEnabled || false,
          sensitivity: (guild?.scamSensitivity as "low" | "medium" | "high") || "medium",
        }}
      />
    </div>
  );
}
