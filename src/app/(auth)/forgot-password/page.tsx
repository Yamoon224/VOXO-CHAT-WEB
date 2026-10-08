import { AuthShell } from "@/components/layout/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Mot de passe oublié" subtitle="Indiquez votre adresse e-mail pour recevoir un lien de réinitialisation.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
