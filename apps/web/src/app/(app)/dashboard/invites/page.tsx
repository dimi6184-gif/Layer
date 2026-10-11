import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPendingInvites } from "@/actions/team";
import { InvitesList } from "@/components/InvitesList";
import { Sparkles } from "lucide-react";

export default async function InvitesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let invites: any[] = [];
  let error = null;

  try {
    invites = await getPendingInvites();
  } catch (err) {
    console.error("Failed to fetch invites:", err);
    error = "Unable to connect to database. Please check your connection.";
  }
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: "#F5F4F5" }}>Team Invitations</h1>
        <p className="text-sm" style={{ color: "#A8A9A2" }}>
          {error ? error : `You have ${invites.length} pending invitation${invites.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Database Connection Issue</h3>
          <p className="text-gray-600 mb-4">We're having trouble connecting to the database. Please try again later.</p>
          <p className="text-sm text-gray-500">If this persists, check that your Supabase database is running.</p>
        </div>
      ) : (
        <InvitesList invites={invites} />
      )}
    </>
  );
}
