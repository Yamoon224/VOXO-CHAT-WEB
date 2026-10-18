import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { StatusProbe } from "@/features/status-page/types";
import type { StatusProbePayload } from "@/features/status-page/api";

export function useStatusProbeForm(submit: (payload: StatusProbePayload) => Promise<void>, initial: StatusProbe | null) {
  const [name, setName] = useState(initial?.name ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [checkIntervalMinutes, setCheckIntervalMinutes] = useState(initial?.check_interval_minutes ?? 5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({ name, url, check_interval_minutes: checkIntervalMinutes });
      if (!initial) {
        setName("");
        setUrl("");
        setCheckIntervalMinutes(5);
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, url, setUrl, checkIntervalMinutes, setCheckIntervalMinutes, isSubmitting, error, handleSubmit };
}
