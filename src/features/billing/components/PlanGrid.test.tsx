import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlanGrid } from "@/features/billing/components/PlanGrid";
import type { Plan } from "@/features/billing/types";

const free: Plan = {
  id: "plan-free",
  slug: "free",
  name: "Gratuit",
  price_cents: 0,
  currency: "EUR",
  billing_interval: "month",
  max_seats: 2,
  max_contacts: 200,
  ai_credits_per_month: 100,
  max_knowledge_documents: 20,
  is_custom: false,
  sort_order: 0,
};

const business: Plan = {
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
};

const enterprise: Plan = {
  id: "plan-enterprise",
  slug: "enterprise",
  name: "Grands comptes",
  price_cents: null,
  currency: "EUR",
  billing_interval: "month",
  max_seats: null,
  max_contacts: null,
  ai_credits_per_month: null,
  max_knowledge_documents: null,
  is_custom: true,
  sort_order: 3,
};

describe("PlanGrid", () => {
  it("marque le palier courant et désactive son bouton", () => {
    render(<PlanGrid plans={[free, business]} currentPlanSlug="free" pendingPlanSlug={null} onSelect={vi.fn()} />);

    expect(screen.getAllByText("Palier actuel")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Palier actuel" })).toBeDisabled();
  });

  it("choisir un palier appelle onSelect avec son slug", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<PlanGrid plans={[free, business]} currentPlanSlug="free" pendingPlanSlug={null} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Choisir ce palier" }));

    expect(onSelect).toHaveBeenCalledWith("business");
  });

  it("l'offre sur devis n'a pas de bouton de souscription", () => {
    render(<PlanGrid plans={[enterprise]} currentPlanSlug="free" pendingPlanSlug={null} onSelect={vi.fn()} />);

    expect(screen.getByText("Contactez-nous pour cette offre.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("affiche les plafonds illimités quand ils sont nuls", () => {
    render(<PlanGrid plans={[enterprise]} currentPlanSlug="free" pendingPlanSlug={null} onSelect={vi.fn()} />);

    expect(screen.getByText("Places illimitées")).toBeInTheDocument();
    expect(screen.getByText("Crédits IA illimités")).toBeInTheDocument();
  });
});
