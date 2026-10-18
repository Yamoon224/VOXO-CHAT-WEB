import { IntegrationsPage } from "@/features/integrations/components/IntegrationsPage";

export default function SettingsIntegrationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Intégrations</h1>
      <IntegrationsPage />
    </div>
  );
}
