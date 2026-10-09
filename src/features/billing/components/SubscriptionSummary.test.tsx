import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubscriptionSummary } from "@/features/billing/components/SubscriptionSummary";
import type { Subscription } from "@/features/billing/types";

const subscription: Subscription = {
  id: "sub-1",
  status: "active",
  status_label: "Actif",
  plan: {
    id: "plan-business",
    slug: "business",
    name: "Business",
    price_cents: 4900,
    currency: "EUR",
    billing_interval: "month",
    max_seats: 20,
    max_contacts: 10000,
    ai_credits_per_month: 5000,
    max_knowledge_documents: 1000,
    is_custom: false,
    sort_order: 2,
  },
  trial_ends_at: null,
  current_period_start: "2026-10-01T00:00:00Z",
  current_period_end: "2026-11-01T00:00:00Z",
  canceled_at: null,
  ai_credit_balance: 3200,
};

describe("SubscriptionSummary", () => {
  it("affiche le palier, le statut et le solde de crédits", () => {
    render(<SubscriptionSummary subscription={subscription} canManage={false} onCancel={vi.fn()} />);

    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Actif")).toBeInTheDocument();
    expect(screen.getByText("3200")).toBeInTheDocument();
  });

  it("ne propose pas de résiliation sans la permission de gestion", () => {
    render(<SubscriptionSummary subscription={subscription} canManage={false} onCancel={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Résilier l'abonnement" })).not.toBeInTheDocument();
  });

  it("résilier appelle onCancel", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(<SubscriptionSummary subscription={subscription} canManage onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Résilier l'abonnement" }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("le palier gratuit ne propose pas de résiliation", () => {
    render(
      <SubscriptionSummary
        subscription={{ ...subscription, plan: { ...subscription.plan, slug: "free" } }}
        canManage
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Résilier l'abonnement" })).not.toBeInTheDocument();
  });
});
