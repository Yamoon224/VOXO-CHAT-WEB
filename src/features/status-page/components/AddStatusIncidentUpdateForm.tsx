"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button } from "@/components/ui";
import { STATUS_INCIDENT_STATUS_LABELS, type StatusIncidentStatus } from "@/features/status-page/types";
import type { StatusIncidentUpdatePayload } from "@/features/status-page/api";
import { ApiError } from "@/lib/api/errors";

const STATUS_OPTIONS = Object.keys(STATUS_INCIDENT_STATUS_LABELS) as StatusIncidentStatus[];

export function AddStatusIncidentUpdateForm({ onSubmit }: { onSubmit: (payload: StatusIncidentUpdatePayload) => Promise<void> }) {
  const [status, setStatus] = useState<StatusIncidentStatus>("monitoring");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ status, body });
      setBody("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-3">
      {error && <Alert variant="error">{error.message}</Alert>}
      <div className="flex flex-wrap items-end gap-2">
        <select
          aria-label="Nouveau statut"
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusIncidentStatus)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {STATUS_INCIDENT_STATUS_LABELS[option]}
            </option>
          ))}
        </select>
        <input
          aria-label="Message de la mise à jour"
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Nouveau message…"
          className="min-w-48 flex-1 rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
        <Button type="submit" variant="secondary" isLoading={isSubmitting}>
          Ajouter
        </Button>
      </div>
    </form>
  );
}
