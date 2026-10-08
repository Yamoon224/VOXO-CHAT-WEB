import { AuthShell } from "@/components/layout/AuthShell";
import { AcceptInvitationForm } from "@/features/invitations/components/AcceptInvitationForm";

export default async function AcceptInvitationPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;

  return (
    <AuthShell title="Rejoindre l'équipe">
      <AcceptInvitationForm token={token} />
    </AuthShell>
  );
}
