export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";

export default async function SocialsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guildId } = await params;
  redirect(`/dashboard/${guildId}`);
}
