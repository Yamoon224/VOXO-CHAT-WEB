import type { InvoiceStatus, SubscriptionStatus } from "@/features/billing/types";

type BadgeTone = "neutral" | "primary" | "danger";

/** Partagé avec le domaine `platform` : la console y affiche les mêmes statuts. */
export const SUBSCRIPTION_STATUS_TONE: Record<SubscriptionStatus, BadgeTone> = {
  trialing: "primary",
  active: "primary",
  past_due: "danger",
  canceled: "neutral",
};

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  paid: "primary",
  open: "neutral",
  void: "neutral",
  uncollectible: "danger",
};
