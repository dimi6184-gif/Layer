import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPendingInvites } from "@/actions/team";
import { InvitesList } from "@/components/InvitesList";

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
        <div
          className="p-5 rounded-2xl text-center"
          style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: "#F5F4F5" }}>Connection issue</p>
          <p className="text-xs" style={{ color: "#A8A9A2" }}>Unable to load invitations. Please try again later.</p>
        </div>
      ) : (
        <InvitesList invites={invites} />
      )}
    </>
  );
}
