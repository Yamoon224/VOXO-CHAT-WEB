import { apiFetch } from "@/lib/api/client";
import type { Invoice, Plan, Subscription } from "@/features/billing/types";

export function listPlans(): Promise<{ data: Plan[] }> {
  return apiFetch("/workspace/billing/plans");
}

export function getSubscription(): Promise<{ data: Subscription }> {
  return apiFetch("/workspace/billing/subscription");
}

export function listInvoices(): Promise<{ data: Invoice[] }> {
  return apiFetch("/workspace/billing/invoices");
}

/** @returns l'URL de paiement hébergée vers laquelle rediriger l'appelant. */
export function startCheckout(planSlug: string): Promise<{ checkout_url: string }> {
  return apiFetch("/workspace/billing/checkout", { method: "POST", body: { plan_slug: planSlug } });
}

export function switchToFreePlan(): Promise<{ data: Subscription }> {
  return apiFetch("/workspace/billing/subscription/switch-to-free", { method: "POST" });
}

export function cancelSubscription(): Promise<{ data: Subscription }> {
  return apiFetch("/workspace/billing/subscription/cancel", { method: "POST" });
}
