import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgentToolsPage } from "@/features/assistant/components/AgentToolsPage";
import * as assistantApi from "@/features/assistant/api";
import type { AgentTool } from "@/features/assistant/types";

vi.mock("@/features/assistant/api");

const tool: AgentTool = {
  id: "tool-1",
  name: "lookup_order",
  description: "Consulte le statut d'une commande.",
  http_method: "GET",
  url: "https://exemple.fr/api/orders/{order_id}",
  headers: { Authorization: "••••-123" },
  parameters: [{ name: "order_id", type: "string", description: "Identifiant", required: true, in: "path" }],
  enabled: true,
  created_at: "2026-10-18T00:00:00Z",
};

describe("AgentToolsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les outils existants", async () => {
    vi.mocked(assistantApi.listAgentTools).mockResolvedValue({ data: [tool] });

    render(<AgentToolsPage />);

    expect(await screen.findByText("lookup_order")).toBeInTheDocument();
    expect(screen.getByText("GET https://exemple.fr/api/orders/{order_id}")).toBeInTheDocument();
  });

  it("cree un nouvel outil", async () => {
    vi.mocked(assistantApi.listAgentTools).mockResolvedValue({ data: [] });
    vi.mocked(assistantApi.createAgentTool).mockResolvedValue({
      data: { ...tool, id: "tool-2", name: "refund_order", headers: null, parameters: [] },
    });
    const user = userEvent.setup();

    render(<AgentToolsPage />);
    await screen.findByText("Aucun outil");

    await user.type(screen.getByLabelText("Nom de l'outil"), "refund_order");
    await user.type(screen.getByLabelText("Description"), "Rembourse une commande.");
    await user.type(screen.getByLabelText("URL"), "https://exemple.fr/api/refund");
    await user.click(screen.getByRole("button", { name: "Ajouter l'outil" }));

    await waitFor(() => expect(screen.getByText("refund_order")).toBeInTheDocument());
    expect(assistantApi.createAgentTool).toHaveBeenCalledWith(
      expect.objectContaining({ name: "refund_order", description: "Rembourse une commande.", url: "https://exemple.fr/api/refund" }),
    );
  });

  it("supprime un outil", async () => {
    vi.mocked(assistantApi.listAgentTools).mockResolvedValue({ data: [tool] });
    vi.mocked(assistantApi.deleteAgentTool).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AgentToolsPage />);
    await screen.findByText("lookup_order");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("lookup_order")).not.toBeInTheDocument());
  });

  it("ne renvoie pas les en-tetes masques non modifies lors d une mise a jour", async () => {
    vi.mocked(assistantApi.listAgentTools).mockResolvedValue({ data: [tool] });
    vi.mocked(assistantApi.updateAgentTool).mockResolvedValue({ data: tool });
    const user = userEvent.setup();

    render(<AgentToolsPage />);
    await screen.findByText("lookup_order");

    await user.click(screen.getByRole("button", { name: "Modifier" }));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() => expect(assistantApi.updateAgentTool).toHaveBeenCalled());
    const payload = vi.mocked(assistantApi.updateAgentTool).mock.calls[0][1];
    expect(payload.headers).toBeUndefined();
  });
});
