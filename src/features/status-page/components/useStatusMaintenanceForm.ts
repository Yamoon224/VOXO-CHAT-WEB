import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { StatusMaintenance } from "@/features/status-page/types";
import type { StatusMaintenancePayload } from "@/features/status-page/api";

/** Les champs `datetime-local` n'ont pas de secondes ni de fuseau : convertis en ISO 8601 à l'envoi. */
function toIso(value: string): string {
  return new Date(value).toISOString();
}

function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function useStatusMaintenanceForm(
  submit: (payload: StatusMaintenancePayload) => Promise<void>,
  initial: StatusMaintenance | null,
) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [scheduledStart, setScheduledStart] = useState(initial ? toDatetimeLocal(initial.scheduled_start) : "");
  const [scheduledEnd, setScheduledEnd] = useState(initial ? toDatetimeLocal(initial.scheduled_end) : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({
        title,
        description: description || null,
        scheduled_start: toIso(scheduledStart),
        scheduled_end: toIso(scheduledEnd),
      });
      if (!initial) {
        setTitle("");
        setDescription("");
        setScheduledStart("");
        setScheduledEnd("");
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    scheduledStart,
    setScheduledStart,
    scheduledEnd,
    setScheduledEnd,
    isSubmitting,
    error,
    handleSubmit,
  };
}
