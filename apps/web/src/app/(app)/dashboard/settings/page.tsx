export const dynamic = 'force-dynamic';
import { auth } from "@/auth";
import { db } from "@nexus/db";
import { redirect } from "next/navigation";
import { AccountSettings } from "@/components/AccountSettings";

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const discordId = (session.user as any).id;

  // Find or create the user in the database to ensure we have a record
  let user = await db.user.findUnique({
    where: { discordId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        discordId,
        username: session.user.name || "User",
        globalTrust: 100,
      },
    });
  }

  const profile = {
    name: session.user.name || user.username,
    email: session.user.email || undefined,
    image: session.user.image || undefined,
    discordId: user.discordId,
    globalTrust: user.globalTrust,
    joinedAt: user.createdAt.toISOString(),
  };

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Account Settings</h1>
        <p className="text-gray-400 font-light">Manage your personal Layer account preferences and API tokens.</p>
      </div>

      <AccountSettings profile={profile} />
    </div>
  );
}
