"use client";

import { useState, type FormEvent } from "react";
import { Alert, Badge, Button, Card, EmptyState, Field, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { usePublicStatusPage } from "@/features/status-page-public/components/usePublicStatusPage";
import type { PublicStatusProbeStatus } from "@/features/status-page-public/types";

const PROBE_STATUS_TONE: Record<PublicStatusProbeStatus, "neutral" | "primary" | "danger"> = {
  unknown: "neutral",
  up: "primary",
  down: "danger",
};

/** Écran `/status/[workspace]` : page publique de la page de statut (section 2.11). */
export function PublicStatusPage({ workspaceId }: { workspaceId: string }) {
  const { loadState, overview, subscribeState, subscribe } = usePublicStatusPage(workspaceId);
  const [email, setEmail] = useState("");

  if (loadState.status === "loading") {
    return (
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-10 text-sm text-muted">
        <Spinner size="sm" />
        Chargement…
      </div>
    );
  }

  if (loadState.status === "error" || overview === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Alert variant="error">{loadState.status === "error" ? loadState.error.message : "Page introuvable."}</Alert>
      </div>
    );
  }

  const allOperational = overview.probes.every((probe) => probe.status !== "down") && overview.ongoing_incidents.length === 0;

  async function handleSubscribe(event: FormEvent) {
    event.preventDefault();
    await subscribe(email);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-semibold text-foreground">Statut</h1>

      <Alert variant={allOperational ? "success" : "error"}>
        {allOperational ? "Tous les systèmes sont opérationnels." : "Certains systèmes sont actuellement affectés."}
      </Alert>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Systèmes</h2>
        {overview.probes.length === 0 ? (
          <EmptyState title="Aucun système surveillé" />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {overview.probes.map((probe) => (
              <li key={probe.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-foreground">{probe.name}</span>
                <div className="flex items-center gap-2">
                  {probe.uptime_ratio !== null && (
                    <span className="text-xs text-muted">{(probe.uptime_ratio * 100).toFixed(2)}% sur 30 jours</span>
                  )}
                  <Badge tone={PROBE_STATUS_TONE[probe.status]}>{probe.status_label}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {overview.ongoing_incidents.length > 0 && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Incidents en cours</h2>
          <ul className="flex flex-col gap-4">
            {overview.ongoing_incidents.map((incident) => (
              <li key={incident.id}>
                <p className="text-sm font-medium text-foreground">
                  {incident.title} <Badge tone="danger">{incident.impact_label}</Badge>
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 border-l border-border pl-3">
                  {incident.updates.map((update) => (
                    <li key={update.id} className="text-sm">
                      <span className="font-medium text-foreground">{update.status_label}</span>{" "}
                      <span className="text-muted">{update.body}</span>
                      <span className="ml-2 text-xs text-muted">{formatDate(update.created_at)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {overview.upcoming_maintenances.length > 0 && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Maintenances à venir</h2>
          <ul className="flex flex-col divide-y divide-border">
            {overview.upcoming_maintenances.map((maintenance) => (
              <li key={maintenance.id} className="py-2 text-sm">
                <p className="font-medium text-foreground">{maintenance.title}</p>
                <p className="text-muted">
                  Du {formatDate(maintenance.scheduled_start)} au {formatDate(maintenance.scheduled_end)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Recevoir les alertes par e-mail</h2>
        {subscribeState.status === "done" ? (
          <Alert variant="success">Inscription enregistrée.</Alert>
        ) : (
          <form onSubmit={handleSubscribe} noValidate className="flex flex-wrap items-end gap-3">
            {subscribeState.status === "error" && <Alert variant="error">{subscribeState.error.message}</Alert>}
            <Field label="E-mail" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <Button type="submit" isLoading={subscribeState.status === "submitting"}>
              S&apos;abonner
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
