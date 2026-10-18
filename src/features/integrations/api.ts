import { apiFetch } from "@/lib/api/client";
import type { ApiKey, WebhookDelivery, WebhookEventType, WebhookSubscription } from "@/features/integrations/types";

export function listWebhookSubscriptions(): Promise<{ data: WebhookSubscription[] }> {
  return apiFetch("/workspace/integrations/webhooks");
}

export type WebhookSubscriptionPayload = {
  url: string;
  event_types: WebhookEventType[];
  enabled?: boolean;
};

export function createWebhookSubscription(payload: WebhookSubscriptionPayload): Promise<{ data: WebhookSubscription }> {
  return apiFetch("/workspace/integrations/webhooks", { method: "POST", body: payload });
}

export function updateWebhookSubscription(id: string, payload: WebhookSubscriptionPayload): Promise<{ data: WebhookSubscription }> {
  return apiFetch(`/workspace/integrations/webhooks/${id}`, { method: "PUT", body: payload });
}

export function deleteWebhookSubscription(id: string): Promise<void> {
  return apiFetch(`/workspace/integrations/webhooks/${id}`, { method: "DELETE" });
}

export function listWebhookDeliveries(id: string): Promise<{ data: WebhookDelivery[] }> {
  return apiFetch(`/workspace/integrations/webhooks/${id}/deliveries`);
}

export function listApiKeys(): Promise<{ data: ApiKey[] }> {
  return apiFetch("/workspace/integrations/api-keys");
}

export function createApiKey(name: string): Promise<{ data: { token: string } }> {
  return apiFetch("/workspace/integrations/api-keys", { method: "POST", body: { name } });
}

export function deleteApiKey(id: string): Promise<void> {
  return apiFetch(`/workspace/integrations/api-keys/${id}`, { method: "DELETE" });
}
