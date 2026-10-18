"use client";

import { useState } from "react";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useStatusMaintenancesPage } from "@/features/status-page/components/useStatusMaintenancesPage";
import { StatusMaintenanceForm } from "@/features/status-page/components/StatusMaintenanceForm";

/** Section « Maintenances » de `/settings/status-page` (lot 7, section 2.11). */
export function StatusMaintenancesPage() {
  const { loadState, maintenances, actionError, create, update, remove } = useStatusMaintenancesPage();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  const editing = maintenances.find((maintenance) => maintenance.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier la maintenance" : "Planifier une maintenance"}</h2>
        <StatusMaintenanceForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Maintenances</h2>
        {maintenances.length === 0 ? (
          <EmptyState title="Aucune maintenance planifiée" />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {maintenances.map((maintenance) => (
              <li key={maintenance.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{maintenance.title}</p>
                  <p className="text-sm text-muted">
                    {maintenance.status_label} · du {formatDate(maintenance.scheduled_start)} au {formatDate(maintenance.scheduled_end)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" type="button" onClick={() => setEditingId(maintenance.id)}>
                    Modifier
                  </Button>
                  <Button variant="danger" type="button" onClick={() => remove(maintenance.id)}>
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
