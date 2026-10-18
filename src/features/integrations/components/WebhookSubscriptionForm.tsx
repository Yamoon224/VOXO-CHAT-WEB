"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useWebhookSubscriptionForm } from "@/features/integrations/components/useWebhookSubscriptionForm";
import { WEBHOOK_EVENT_TYPE_LABELS, type WebhookEventType, type WebhookSubscription } from "@/features/integrations/types";
import type { WebhookSubscriptionPayload } from "@/features/integrations/api";

const EVENT_TYPE_OPTIONS = Object.keys(WEBHOOK_EVENT_TYPE_LABELS) as WebhookEventType[];

export function WebhookSubscriptionForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: WebhookSubscription | null;
  onSubmit: (payload: WebhookSubscriptionPayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const { url, setUrl, enabled, setEnabled, eventTypes, toggleEventType, isSubmitting, error, handleSubmit } = useWebhookSubscriptionForm(
    onSubmit,
    initial ?? null,
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="URL de destination" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} />

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Abonnement actif
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Évènements</p>
        <div className="flex flex-col gap-1">
          {EVENT_TYPE_OPTIONS.map((eventType) => (
            <label key={eventType} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={eventTypes.includes(eventType)} onChange={() => toggleEventType(eventType)} />
              {WEBHOOK_EVENT_TYPE_LABELS[eventType]}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Ajouter l'abonnement"}
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
