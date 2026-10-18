"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useStatusMaintenanceForm } from "@/features/status-page/components/useStatusMaintenanceForm";
import type { StatusMaintenance } from "@/features/status-page/types";
import type { StatusMaintenancePayload } from "@/features/status-page/api";

export function StatusMaintenanceForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: StatusMaintenance | null;
  onSubmit: (payload: StatusMaintenancePayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const { title, setTitle, description, setDescription, scheduledStart, setScheduledStart, scheduledEnd, setScheduledEnd, isSubmitting, error, handleSubmit } =
    useStatusMaintenanceForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Titre" required value={title} onChange={(event) => setTitle(event.target.value)} />
      <Field label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Début prévu"
          type="datetime-local"
          required
          value={scheduledStart}
          onChange={(event) => setScheduledStart(event.target.value)}
        />
        <Field
          label="Fin prévue"
          type="datetime-local"
          required
          value={scheduledEnd}
          onChange={(event) => setScheduledEnd(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Planifier la maintenance"}
        </Button>
        {initial && onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
