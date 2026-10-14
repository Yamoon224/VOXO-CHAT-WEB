import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TicketListPage } from "@/features/tickets/components/TicketListPage";
import * as ticketsApi from "@/features/tickets/api";
import type { Ticket } from "@/features/tickets/types";

vi.mock("@/features/tickets/api");

const ticket: Ticket = {
  id: "ticket-1",
  priority: "urgent",
  priority_label: "Urgente",
  due_at: null,
  is_overdue: false,
  created_at: "2026-10-14T00:00:00Z",
  contact: { id: "contact-1", name: "Client Exemple", email: "client@exemple.fr" },
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

describe("TicketListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les tickets de l'espace courant", async () => {
    vi.mocked(ticketsApi.listTickets).mockResolvedValue({
      data: [ticket],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });

    render(<TicketListPage />);

    expect(await screen.findByText("Problème de livraison")).toBeInTheDocument();
    expect(screen.getByText("Urgente")).toBeInTheDocument();
  });

  it("affiche un etat vide sans ticket", async () => {
    vi.mocked(ticketsApi.listTickets).mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 },
    });

    render(<TicketListPage />);

    expect(await screen.findByText("Aucun ticket")).toBeInTheDocument();
  });
});
