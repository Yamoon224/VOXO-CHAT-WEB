import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReplyForm } from "@/features/conversations/components/ReplyForm";
import type { CannedResponse } from "@/features/conversations/types";

const cannedResponse: CannedResponse = {
  id: "cr-1",
  title: "Bienvenue",
  body: "Bonjour et bienvenue !",
  created_at: "2026-10-09T00:00:00Z",
};

describe("ReplyForm", () => {
  it("envoie une réponse publique par défaut", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ReplyForm cannedResponses={[]} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Message"), "Bonjour, comment puis-je vous aider ?");
    await user.click(screen.getByRole("button", { name: "Répondre" }));

    expect(onSubmit).toHaveBeenCalledWith("Bonjour, comment puis-je vous aider ?", "public");
  });

  it("envoie une note interne quand la case est cochée", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ReplyForm cannedResponses={[]} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Message"), "À vérifier avant de répondre.");
    await user.click(screen.getByLabelText("Note interne (non visible du visiteur)"));
    await user.click(screen.getByRole("button", { name: "Ajouter la note" }));

    expect(onSubmit).toHaveBeenCalledWith("À vérifier avant de répondre.", "internal");
  });

  it("insère une réponse pré-enregistrée dans le message", async () => {
    const user = userEvent.setup();

    render(<ReplyForm cannedResponses={[cannedResponse]} onSubmit={vi.fn()} />);

    await user.selectOptions(screen.getByLabelText("Insérer une réponse pré-enregistrée"), "cr-1");

    expect(screen.getByLabelText("Message")).toHaveValue("Bonjour et bienvenue !");
  });
});
