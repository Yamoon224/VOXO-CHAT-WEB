import { AuthShell } from "@/components/layout/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell title="Créer un compte" subtitle="Essai gratuit, sans carte bancaire.">
      <RegisterForm />
    </AuthShell>
  );
}
