import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { WebhookEventType, WebhookSubscription } from "@/features/integrations/types";
import type { WebhookSubscriptionPayload } from "@/features/integrations/api";

export function useWebhookSubscriptionForm(
  submit: (payload: WebhookSubscriptionPayload) => Promise<void>,
  initial: WebhookSubscription | null,
) {
  const [url, setUrl] = useState(initial?.url ?? "");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [eventTypes, setEventTypes] = useState<WebhookEventType[]>(initial?.event_types ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function toggleEventType(eventType: WebhookEventType) {
    setEventTypes((current) => (current.includes(eventType) ? current.filter((value) => value !== eventType) : [...current, eventType]));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({ url, enabled, event_types: eventTypes });
      if (!initial) {
        setUrl("");
        setEnabled(true);
        setEventTypes([]);
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { url, setUrl, enabled, setEnabled, eventTypes, toggleEventType, isSubmitting, error, handleSubmit };
}
