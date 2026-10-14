import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyTicketsPage } from "@/features/portal/components/MyTicketsPage";
import * as portalApi from "@/features/portal/api";

vi.mock("@/features/portal/api");

describe("MyTicketsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les demandes du contact designe par le jeton", async () => {
    vi.mocked(portalApi.listMyTickets).mockResolvedValue({
      data: [
        { id: "ticket-1", subject: "Problème de livraison", status: "open", status_label: "Ouverte", priority_label: "Normale", last_message_at: null, created_at: "2026-10-14T00:00:00Z" },
      ],
    });

    render(<MyTicketsPage token="jeton-abc" />);

    expect(await screen.findByText("Problème de livraison")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Problème de livraison/ })).toHaveAttribute(
      "href",
      "/portal/tickets/ticket-1?token=jeton-abc",
    );
  });

  it("affiche un etat vide sans demande", async () => {
    vi.mocked(portalApi.listMyTickets).mockResolvedValue({ data: [] });

    render(<MyTicketsPage token="jeton-abc" />);

    expect(await screen.findByText("Aucune demande")).toBeInTheDocument();
  });
});
