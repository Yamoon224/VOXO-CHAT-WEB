import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CannedResponseForm } from "@/features/conversations/components/CannedResponseForm";

describe("CannedResponseForm", () => {
  it("ajoute une reponse puis vide le formulaire", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CannedResponseForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Titre"), "Bienvenue");
    await user.type(screen.getByLabelText("Texte"), "Bonjour !");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSubmit).toHaveBeenCalledWith("Bienvenue", "Bonjour !");
    expect(await screen.findByLabelText("Titre")).toHaveValue("");
  });

  it("pré-remplit en mode modification et propose d'annuler", async () => {
    const onCancel = vi.fn();

    render(<CannedResponseForm initial={{ title: "Au revoir", body: "Merci !" }} onSubmit={vi.fn()} onCancel={onCancel} />);

    expect(screen.getByLabelText("Titre")).toHaveValue("Au revoir");
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: "Annuler" }));
    expect(onCancel).toHaveBeenCalled();
  });
});
