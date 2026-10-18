"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useStatusProbesPage } from "@/features/status-page/components/useStatusProbesPage";
import { StatusProbeForm } from "@/features/status-page/components/StatusProbeForm";
import type { StatusProbeStatus } from "@/features/status-page/types";

const STATUS_TONE: Record<StatusProbeStatus, "neutral" | "primary" | "danger"> = { unknown: "neutral", up: "primary", down: "danger" };

/** Section « Sondes » de `/settings/status-page` (lot 7, section 2.11). */
export function StatusProbesPage() {
  const { loadState, probes, actionError, create, update, remove } = useStatusProbesPage();
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

  const editing = probes.find((probe) => probe.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier la sonde" : "Ajouter une sonde"}</h2>
        <StatusProbeForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Sondes</h2>
        {probes.length === 0 ? (
          <EmptyState title="Aucune sonde" description="Ajoutez une URL à vérifier périodiquement." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {probes.map((probe) => (
              <li key={probe.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {probe.name} <Badge tone={STATUS_TONE[probe.status]}>{probe.status_label}</Badge>
                  </p>
                  <p className="break-all text-sm text-muted">
                    {probe.url} · toutes les {probe.check_interval_minutes} min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" type="button" onClick={() => setEditingId(probe.id)}>
                    Modifier
                  </Button>
                  <Button variant="danger" type="button" onClick={() => remove(probe.id)}>
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
