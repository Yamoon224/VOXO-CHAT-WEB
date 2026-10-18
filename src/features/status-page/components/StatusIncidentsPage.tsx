"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useStatusIncidentsPage } from "@/features/status-page/components/useStatusIncidentsPage";
import { StatusIncidentForm } from "@/features/status-page/components/StatusIncidentForm";
import { AddStatusIncidentUpdateForm } from "@/features/status-page/components/AddStatusIncidentUpdateForm";
import type { StatusIncidentStatus } from "@/features/status-page/types";

const STATUS_TONE: Record<StatusIncidentStatus, "neutral" | "primary" | "danger"> = {
  investigating: "danger",
  identified: "danger",
  monitoring: "neutral",
  resolved: "primary",
};

/** Section « Incidents » de `/settings/status-page` (lot 7, section 2.11). */
export function StatusIncidentsPage() {
  const { loadState, incidents, actionError, create, remove, updatesByIncident, loadUpdates, addUpdate } = useStatusIncidentsPage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  async function toggleExpanded(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    await loadUpdates(id);
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Ouvrir un incident</h2>
        <StatusIncidentForm onSubmit={create} />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Incidents</h2>
        {incidents.length === 0 ? (
          <EmptyState title="Aucun incident" description="Tout fonctionne normalement." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {incidents.map((incident) => (
              <li key={incident.id} className="flex flex-col gap-2 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {incident.title} <Badge tone={STATUS_TONE[incident.status]}>{incident.status_label}</Badge>
                    </p>
                    <p className="text-sm text-muted">
                      {incident.impact_label} · ouvert le {formatDate(incident.started_at)}
                      {incident.resolved_at && ` · résolu le ${formatDate(incident.resolved_at)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" type="button" onClick={() => void toggleExpanded(incident.id)}>
                      {expandedId === incident.id ? "Masquer la chronologie" : "Voir la chronologie"}
                    </Button>
                    <Button variant="danger" type="button" onClick={() => remove(incident.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>

                {expandedId === incident.id && (
                  <div className="flex flex-col gap-3">
                    <ul className="flex flex-col gap-2 rounded-md border border-border bg-muted/10 p-3">
                      {(updatesByIncident[incident.id] ?? []).map((update) => (
                        <li key={update.id} className="text-sm">
                          <Badge tone={STATUS_TONE[update.status]}>{update.status_label}</Badge>{" "}
                          <span className="text-foreground">{update.body}</span>
                          <span className="ml-2 text-xs text-muted">{formatDate(update.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                    {incident.status !== "resolved" && (
                      <AddStatusIncidentUpdateForm onSubmit={(payload) => addUpdate(incident.id, payload)} />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
