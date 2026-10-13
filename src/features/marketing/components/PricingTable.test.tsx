import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingTable } from "@/features/marketing/components/PricingTable";
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
  is_active: true,
  sort_order: 0,
  provider_price_id: null,
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
  is_active: true,
  sort_order: 3,
  provider_price_id: null,
};

describe("PricingTable", () => {
  it("affiche le prix et les plafonds de chaque palier", () => {
    render(<PricingTable plans={[free]} />);

    expect(screen.getByText("Gratuit")).toBeInTheDocument();
    expect(screen.getByText("0,00 €")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Essayer gratuitement" })).toHaveAttribute("href", "/register");
  });

  it("affiche un contact pour l'offre sur devis, avec des plafonds illimités", () => {
    render(<PricingTable plans={[enterprise]} />);

    expect(screen.getByText("Sur devis")).toBeInTheDocument();
    expect(screen.getAllByText("Illimité")).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Nous contacter" })).toHaveAttribute("href", "mailto:contact@voxo.chat");
  });
});
