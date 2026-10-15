import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactSegmentForm } from "@/features/contacts/components/ContactSegmentForm";
import type { ContactSegment } from "@/features/contacts/types";

describe("ContactSegmentForm", () => {
  it("cree un segment avec un critere", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ContactSegmentForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nom du segment"), "Clients VIP");
    await user.type(screen.getByLabelText("Champ"), "email");
    await user.selectOptions(screen.getByLabelText("Condition"), "contains");
    await user.type(screen.getByLabelText("Valeur"), "acme.com");
    await user.click(screen.getByRole("button", { name: "Créer le segment" }));

    expect(onSubmit).toHaveBeenCalledWith("Clients VIP", [{ field: "email", operator: "contains", value: "acme.com" }]);
  });

  it("cache le champ valeur pour les operateurs sans valeur", async () => {
    const user = userEvent.setup();

    render(<ContactSegmentForm onSubmit={vi.fn()} />);

    await user.selectOptions(screen.getByLabelText("Condition"), "is_set");

    expect(screen.queryByLabelText("Valeur")).not.toBeInTheDocument();
  });

  it("ajoute et retire des criteres", async () => {
    const user = userEvent.setup();

    render(<ContactSegmentForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Ajouter un critère" }));
    expect(screen.getAllByLabelText("Champ")).toHaveLength(2);

    await user.click(screen.getAllByRole("button", { name: "Retirer" })[0]);
    expect(screen.getAllByLabelText("Champ")).toHaveLength(1);
  });

  it("pre-remplit le formulaire en modification", () => {
    const segment: ContactSegment = {
      id: "seg-1",
      name: "Segment existant",
      criteria: [{ field: "phone", operator: "is_not_set", value: null }],
    };

    render(<ContactSegmentForm initial={segment} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByDisplayValue("Segment existant")).toBeInTheDocument();
    expect(screen.getByDisplayValue("phone")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();
  });
});
