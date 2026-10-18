import { StatusProbesPage } from "@/features/status-page/components/StatusProbesPage";
import { StatusIncidentsPage } from "@/features/status-page/components/StatusIncidentsPage";
import { StatusMaintenancesPage } from "@/features/status-page/components/StatusMaintenancesPage";
import { StatusSubscribersPage } from "@/features/status-page/components/StatusSubscribersPage";

export default function SettingsStatusPagePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Page de statut</h1>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Sondes</h2>
        <StatusProbesPage />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Incidents</h2>
        <StatusIncidentsPage />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Maintenances</h2>
        <StatusMaintenancesPage />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Abonnés</h2>
        <StatusSubscribersPage />
      </section>
    </div>
  );
}
