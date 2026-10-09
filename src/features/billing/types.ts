export type BillingInterval = "month" | "year";

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export type InvoiceStatus = "open" | "paid" | "void" | "uncollectible";

export type Plan = {
  id: string;
  slug: string;
  name: string;
  /** `null` : tarif sur devis (offre grands comptes). */
  price_cents: number | null;
  currency: string;
  billing_interval: BillingInterval;
  /** `null` sur l'un de ces plafonds : illimité. */
  max_seats: number | null;
  max_contacts: number | null;
  ai_credits_per_month: number | null;
  max_knowledge_documents: number | null;
  is_custom: boolean;
  sort_order: number;
};

export type Subscription = {
  id: string;
  status: SubscriptionStatus;
  status_label: string;
  plan: Plan;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  ai_credit_balance: number;
};

export type Invoice = {
  id: string;
  amount_cents: number;
  currency: string;
  status: InvoiceStatus;
  hosted_invoice_url: string | null;
  issued_at: string | null;
  paid_at: string | null;
};
