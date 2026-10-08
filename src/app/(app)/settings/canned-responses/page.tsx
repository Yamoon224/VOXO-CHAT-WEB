import { CannedResponsesPage } from "@/features/conversations/components/CannedResponsesPage";

export default function SettingsCannedResponsesPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Réponses pré-enregistrées</h1>
      <CannedResponsesPage />
    </div>
  );
}
