import { Card } from "@/components/ui";
import { WorkspaceSettingsForm } from "@/features/workspace/components/WorkspaceSettingsForm";

export default function WorkspaceSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Espace de travail</h1>

      <Card>
        <WorkspaceSettingsForm />
      </Card>
    </div>
  );
}
