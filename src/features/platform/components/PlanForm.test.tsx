import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlanForm } from "@/features/platform/components/PlanForm";
import type { Plan } from "@/features/billing/types";

const plan: Plan = {
  id: "plan-1",
  slug: "starter",
  name: "Starter",
  price_cents: 1900,
  currency: "EUR",
  billing_interval: "month",
  max_seats: 5,
  max_contacts: 2000,
  ai_credits_per_month: 1000,
  max_knowledge_documents: 200,
  is_custom: false,
  is_active: true,
  sort_order: 1,
  provider_price_id: null,
};

describe("PlanForm", () => {
  it("cree un palier", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<PlanForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Identifiant"), "pro");
    await user.type(screen.getByLabelText("Nom"), "Pro");
    await user.click(screen.getByRole("button", { name: "Créer le palier" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "pro", name: "Pro", price_cents: null, max_seats: null }),
    );
  });

  it("pre-remplit en mode modification et propose d'annuler", async () => {
    const onCancel = vi.fn();

    render(<PlanForm initial={plan} onSubmit={vi.fn()} onCancel={onCancel} />);

    expect(screen.getByLabelText("Identifiant")).toHaveValue("starter");
    expect(screen.getByLabelText("Sièges maximum (vide = illimité)")).toHaveValue(5);
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: "Annuler" }));
    expect(onCancel).toHaveBeenCalled();
  });
});
