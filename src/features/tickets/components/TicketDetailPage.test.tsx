import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TicketDetailPage } from "@/features/tickets/components/TicketDetailPage";
import * as ticketsApi from "@/features/tickets/api";
import type { Ticket } from "@/features/tickets/types";

vi.mock("@/features/tickets/api");

const ticket: Ticket = {
  id: "ticket-1",
  priority: "high",
  priority_label: "Haute",
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

describe("TicketDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le ticket et le lien vers sa conversation", async () => {
    vi.mocked(ticketsApi.getTicket).mockResolvedValue({ data: ticket });

    render(<TicketDetailPage ticketId="ticket-1" />);

    expect(await screen.findByText("Problème de livraison")).toBeInTheDocument();
    expect(screen.getByText("Client Exemple — client@exemple.fr")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir la conversation/ })).toHaveAttribute("href", "/conversations/conv-1");
  });
});
