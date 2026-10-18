import { useCallback, useEffect, useState } from "react";
import * as integrationsApi from "@/features/integrations/api";
import { ApiError } from "@/lib/api/errors";
import type { WebhookDelivery, WebhookSubscription } from "@/features/integrations/types";
import type { WebhookSubscriptionPayload } from "@/features/integrations/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useWebhookSubscriptionsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [subscriptions, setSubscriptions] = useState<WebhookSubscription[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [deliveriesBySubscription, setDeliveriesBySubscription] = useState<Record<string, WebhookDelivery[]>>({});

  const load = useCallback(async () => {
    try {
      const { data } = await integrationsApi.listWebhookSubscriptions();
      setSubscriptions(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: WebhookSubscriptionPayload) {
    const { data } = await integrationsApi.createWebhookSubscription(payload);
    setSubscriptions((current) => [data, ...current]);
  }

  async function update(id: string, payload: WebhookSubscriptionPayload) {
    const { data } = await integrationsApi.updateWebhookSubscription(id, payload);
    setSubscriptions((current) => current.map((subscription) => (subscription.id === id ? data : subscription)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await integrationsApi.deleteWebhookSubscription(id);
      setSubscriptions((current) => current.filter((subscription) => subscription.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function loadDeliveries(id: string) {
    setActionError(null);
    try {
      const { data } = await integrationsApi.listWebhookDeliveries(id);
      setDeliveriesBySubscription((current) => ({ ...current, [id]: data }));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, subscriptions, actionError, create, update, remove, deliveriesBySubscription, loadDeliveries };
}
