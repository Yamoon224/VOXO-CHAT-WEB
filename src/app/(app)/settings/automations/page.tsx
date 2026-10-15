import { AutomationScenariosPage } from "@/features/automations/components/AutomationScenariosPage";

export default function SettingsAutomationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Automatisations</h1>
      <AutomationScenariosPage />
    </div>
  );
}
