import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OpenTicketForm } from "@/features/portal/components/OpenTicketForm";
import * as portalApi from "@/features/portal/api";

vi.mock("@/features/portal/api");

describe("OpenTicketForm", () => {
  it("ouvre une demande puis affiche la confirmation", async () => {
    vi.mocked(portalApi.openTicket).mockResolvedValue({
      data: { id: "ticket-1", subject: "Problème", status: "open", status_label: "Ouverte", priority_label: "Normale", last_message_at: null, created_at: "2026-10-14T00:00:00Z" },
    });
    const user = userEvent.setup();

    render(<OpenTicketForm workspaceId="workspace-1" />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "client@exemple.fr");
    await user.type(screen.getByLabelText("Sujet"), "Problème de livraison");
    await user.type(screen.getByLabelText("Message"), "Ma commande n'est jamais arrivée.");
    await user.click(screen.getByRole("button", { name: "Envoyer ma demande" }));

    expect(await screen.findByText(/bien été reçue/)).toBeInTheDocument();
    expect(portalApi.openTicket).toHaveBeenCalledWith("workspace-1", {
      email: "client@exemple.fr",
      name: undefined,
      subject: "Problème de livraison",
      message: "Ma commande n'est jamais arrivée.",
    });
  });
});
