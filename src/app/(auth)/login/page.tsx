import { AuthShell } from "@/components/layout/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell title="Connexion" subtitle="Accédez à votre espace de travail VOXO.">
      <LoginForm />
    </AuthShell>
  );
}
