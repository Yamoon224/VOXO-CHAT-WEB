import { useCallback, useEffect, useState } from "react";
import * as billingApi from "@/features/billing/api";
import { ApiError } from "@/lib/api/errors";
import type { Invoice, Plan, Subscription } from "@/features/billing/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/**
 * Facturation de l'espace de travail courant : abonnement, grille tarifaire
 * et factures, avec leurs actions. Une seule source de vérité pour l'écran
 * `/settings/billing`.
 */
export function useBillingPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [pendingPlanSlug, setPendingPlanSlug] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [subscriptionResponse, plansResponse, invoicesResponse] = await Promise.all([
        billingApi.getSubscription(),
        billingApi.listPlans(),
        billingApi.listInvoices(),
      ]);
      setSubscription(subscriptionResponse.data);
      setPlans(plansResponse.data);
      setInvoices(invoicesResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Palier gratuit : bascule directe. Palier payant : redirige vers le paiement hébergé. */
  async function changeToPlan(planSlug: string) {
    setActionError(null);
    setPendingPlanSlug(planSlug);
    try {
      if (planSlug === "free") {
        const { data } = await billingApi.switchToFreePlan();
        setSubscription(data);
        return;
      }

      const { checkout_url } = await billingApi.startCheckout(planSlug);
      window.location.href = checkout_url;
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setPendingPlanSlug(null);
    }
  }

  async function cancelSubscription() {
    setActionError(null);
    try {
      const { data } = await billingApi.cancelSubscription();
      setSubscription(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, subscription, plans, invoices, actionError, pendingPlanSlug, changeToPlan, cancelSubscription };
}
