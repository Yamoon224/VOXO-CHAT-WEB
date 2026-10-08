import { AuthShell } from "@/components/layout/AuthShell";
import { VerifyEmailStatus } from "@/features/auth/components/VerifyEmailStatus";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;

  return (
    <AuthShell title="Vérification de l'adresse e-mail">
      <VerifyEmailStatus token={token} />
    </AuthShell>
  );
}
