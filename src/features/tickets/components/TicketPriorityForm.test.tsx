import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TicketPriorityForm } from "@/features/tickets/components/TicketPriorityForm";
import type { Ticket } from "@/features/tickets/types";

const ticket: Ticket = {
  id: "ticket-1",
  priority: "normal",
  priority_label: "Normale",
  due_at: null,
  is_overdue: false,
  created_at: "2026-10-14T00:00:00Z",
  contact: null,
  conversation: {
    id: "conv-1",
    channel: "ticket",
    channel_label: "Ticket",
    status: "open",
    status_label: "Ouverte",
    subject: "Problème de livraison",
    visitor_name: null,
    visitor_email: "client@exemple.fr",
    assigned_user: null,
    last_message_at: null,
  },
};

describe("TicketPriorityForm", () => {
  it("enregistre la priorite et l'echeance modifiees", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<TicketPriorityForm ticket={ticket} update={update} />);

    await user.selectOptions(screen.getByLabelText("Priorité"), "urgent");
    await user.type(screen.getByLabelText("Échéance"), "2026-12-01");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith({ priority: "urgent", due_at: "2026-12-01" });
  });

  it("envoie une echeance nulle quand le champ est vide", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<TicketPriorityForm ticket={ticket} update={update} />);

    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith({ priority: "normal", due_at: null });
  });
});
