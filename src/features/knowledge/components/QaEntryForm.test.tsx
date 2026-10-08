import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QaEntryForm } from "@/features/knowledge/components/QaEntryForm";

describe("QaEntryForm", () => {
  it("ajoute une entree puis vide le formulaire", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<QaEntryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Question"), "Quels sont vos horaires ?");
    await user.type(screen.getByLabelText("Réponse"), "De 9h à 18h.");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSubmit).toHaveBeenCalledWith("Quels sont vos horaires ?", "De 9h à 18h.");
    expect(await screen.findByLabelText("Question")).toHaveValue("");
  });

  it("pré-remplit et propose d'annuler en mode modification", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();

    render(
      <QaEntryForm
        initial={{ question: "Livrez-vous le dimanche ?", answer: "Non." }}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByLabelText("Question")).toHaveValue("Livrez-vous le dimanche ?");
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: "Annuler" }));
    expect(onCancel).toHaveBeenCalled();
  });
});
