import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TicketThreadPage } from "@/features/portal/components/TicketThreadPage";
import * as portalApi from "@/features/portal/api";

vi.mock("@/features/portal/api");

const ticket = {
  id: "ticket-1",
  subject: "Problème de livraison",
  status: "open" as const,
  status_label: "Ouverte",
  priority_label: "Normale",
  last_message_at: null,
  created_at: "2026-10-14T00:00:00Z",
};

const initialMessage = { id: "m-1", sender_type: "visitor" as const, body: "Ma commande n'est jamais arrivée.", created_at: "2026-10-14T00:00:00Z" };

describe("TicketThreadPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le fil et permet de repondre", async () => {
    vi.mocked(portalApi.getMyTicket).mockResolvedValue({ data: { ticket, messages: [initialMessage] } });
    vi.mocked(portalApi.replyToTicket).mockResolvedValue({ data: ticket });
    const user = userEvent.setup();

    render(<TicketThreadPage token="jeton-abc" ticketId="ticket-1" />);

    expect(await screen.findByText("Ma commande n'est jamais arrivée.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Votre réponse"), "Toujours rien reçu.");
    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => expect(portalApi.replyToTicket).toHaveBeenCalledWith("jeton-abc", "ticket-1", "Toujours rien reçu."));
  });
});
