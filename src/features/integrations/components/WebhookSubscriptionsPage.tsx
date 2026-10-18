"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useWebhookSubscriptionsPage } from "@/features/integrations/components/useWebhookSubscriptionsPage";
import { WebhookSubscriptionForm } from "@/features/integrations/components/WebhookSubscriptionForm";
import { WEBHOOK_EVENT_TYPE_LABELS, type WebhookDeliveryStatus } from "@/features/integrations/types";

const DELIVERY_STATUS_TONE: Record<WebhookDeliveryStatus, "neutral" | "primary" | "danger"> = {
  pending: "neutral",
  success: "primary",
  failed: "danger",
};

const DELIVERY_STATUS_LABELS: Record<WebhookDeliveryStatus, string> = {
  pending: "En attente",
  success: "Réussie",
  failed: "Échouée",
};

/** Section « Webhooks sortants » de `/settings/integrations` (lot 6, section 2.14). */
export function WebhookSubscriptionsPage() {
  const { loadState, subscriptions, actionError, create, update, remove, deliveriesBySubscription, loadDeliveries } =
    useWebhookSubscriptionsPage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const editing = subscriptions.find((subscription) => subscription.id === editingId) ?? null;

  async function toggleDeliveries(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    await loadDeliveries(id);
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier l'abonnement" : "Ajouter un abonnement"}</h2>
        <WebhookSubscriptionForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Webhooks sortants</h2>
        {subscriptions.length === 0 ? (
          <EmptyState title="Aucun abonnement" description="Ajoutez une URL pour relayer les évènements de cet espace vers un système tiers." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {subscriptions.map((subscription) => (
              <li key={subscription.id} className="flex flex-col gap-2 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="break-all text-sm font-medium text-foreground">
                      {subscription.url} {!subscription.enabled && <span className="text-muted">(désactivé)</span>}
                    </p>
                    <p className="text-sm text-muted">
                      {subscription.event_types.map((eventType) => WEBHOOK_EVENT_TYPE_LABELS[eventType]).join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Secret de signature : <code className="rounded bg-muted/30 px-1 py-0.5">{subscription.secret}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" type="button" onClick={() => toggleDeliveries(subscription.id)}>
                      {expandedId === subscription.id ? "Masquer les livraisons" : "Voir les livraisons"}
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => setEditingId(subscription.id)}>
                      Modifier
                    </Button>
                    <Button variant="danger" type="button" onClick={() => remove(subscription.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>

                {expandedId === subscription.id && (
                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    {(deliveriesBySubscription[subscription.id] ?? []).length === 0 ? (
                      <p className="text-sm text-muted">Aucune livraison pour le moment.</p>
                    ) : (
                      <ul className="flex flex-col gap-1.5">
                        {(deliveriesBySubscription[subscription.id] ?? []).map((delivery) => (
                          <li key={delivery.id} className="flex items-center gap-2 text-sm text-foreground">
                            <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABELS[delivery.status]}</Badge>
                            <span>{delivery.event_type}</span>
                            {delivery.response_status !== null && <span className="text-muted">HTTP {delivery.response_status}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
