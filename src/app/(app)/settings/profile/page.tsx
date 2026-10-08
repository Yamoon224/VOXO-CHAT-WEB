import { Card } from "@/components/ui";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { PasswordForm } from "@/features/profile/components/PasswordForm";

export default function ProfileSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Profil</h1>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Informations générales</h2>
        <ProfileForm />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Mot de passe</h2>
        <PasswordForm />
      </Card>
    </div>
  );
}
