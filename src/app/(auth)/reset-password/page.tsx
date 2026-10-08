import { AuthShell } from "@/components/layout/AuthShell";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email = "", token = "" } = await searchParams;

  return (
    <AuthShell title="Réinitialiser le mot de passe">
      <ResetPasswordForm email={email} token={token} />
    </AuthShell>
  );
}
