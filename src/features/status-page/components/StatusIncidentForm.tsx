"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Field } from "@/components/ui";
import {
  STATUS_INCIDENT_IMPACT_LABELS,
  STATUS_INCIDENT_STATUS_LABELS,
  type StatusIncidentImpact,
  type StatusIncidentStatus,
} from "@/features/status-page/types";
import type { StatusIncidentPayload } from "@/features/status-page/api";
import { ApiError } from "@/lib/api/errors";

const IMPACT_OPTIONS = Object.keys(STATUS_INCIDENT_IMPACT_LABELS) as StatusIncidentImpact[];
const STATUS_OPTIONS = Object.keys(STATUS_INCIDENT_STATUS_LABELS) as StatusIncidentStatus[];

/** Formulaire d'ouverture d'un incident — toujours accompagné d'un premier message de chronologie. */
export function StatusIncidentForm({ onSubmit }: { onSubmit: (payload: StatusIncidentPayload) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [impact, setImpact] = useState<StatusIncidentImpact>("minor");
  const [status, setStatus] = useState<StatusIncidentStatus>("investigating");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ title, impact, status, body });
      setTitle("");
      setImpact("minor");
      setStatus("investigating");
      setBody("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Titre" required value={title} onChange={(event) => setTitle(event.target.value)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="incident-impact" className="text-sm font-medium text-foreground">
            Impact
          </label>
          <select
            id="incident-impact"
            value={impact}
            onChange={(event) => setImpact(event.target.value as StatusIncidentImpact)}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            {IMPACT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {STATUS_INCIDENT_IMPACT_LABELS[option]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="incident-status" className="text-sm font-medium text-foreground">
            Statut
          </label>
          <select
            id="incident-status"
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
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="incident-body" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="incident-body"
          required
          rows={3}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Ouvrir l&apos;incident
        </Button>
      </div>
    </form>
  );
}
