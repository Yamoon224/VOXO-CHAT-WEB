"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useStatusProbeForm } from "@/features/status-page/components/useStatusProbeForm";
import type { StatusProbe } from "@/features/status-page/types";
import type { StatusProbePayload } from "@/features/status-page/api";

export function StatusProbeForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: StatusProbe | null;
  onSubmit: (payload: StatusProbePayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const { name, setName, url, setUrl, checkIntervalMinutes, setCheckIntervalMinutes, isSubmitting, error, handleSubmit } =
    useStatusProbeForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Nom" required value={name} onChange={(event) => setName(event.target.value)} />
      <Field label="URL vérifiée" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} />
      <Field
        label="Intervalle (minutes)"
        type="number"
        min={1}
        max={1440}
        required
        value={checkIntervalMinutes}
        onChange={(event) => setCheckIntervalMinutes(Number(event.target.value))}
      />

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Ajouter la sonde"}
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
