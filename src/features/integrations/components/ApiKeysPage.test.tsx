import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiKeysPage } from "@/features/integrations/components/ApiKeysPage";
import * as integrationsApi from "@/features/integrations/api";
import type { ApiKey } from "@/features/integrations/types";

vi.mock("@/features/integrations/api");

const apiKey: ApiKey = { id: "key-1", name: "Zapier", created_by_name: "Awa", last_used_at: null, created_at: "2026-10-17T00:00:00Z" };

describe("ApiKeysPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les cles existantes", async () => {
    vi.mocked(integrationsApi.listApiKeys).mockResolvedValue({ data: [apiKey] });

    render(<ApiKeysPage />);

    expect(await screen.findByText("Zapier")).toBeInTheDocument();
    expect(screen.getByText(/jamais utilisée/)).toBeInTheDocument();
  });

  it("emet une cle et affiche le jeton une seule fois", async () => {
    vi.mocked(integrationsApi.listApiKeys).mockResolvedValue({ data: [] });
    vi.mocked(integrationsApi.createApiKey).mockResolvedValue({ data: { token: "plain-token-123" } });
    const user = userEvent.setup();

    render(<ApiKeysPage />);
    await screen.findByText("Aucune clé");

    await user.type(screen.getByLabelText("Nom de la clé"), "Zapier");
    await user.click(screen.getByRole("button", { name: "Émettre la clé" }));

    expect(await screen.findByText("plain-token-123")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "J'ai copié la clé" }));
    expect(screen.queryByText("plain-token-123")).not.toBeInTheDocument();
  });

  it("revoque une cle", async () => {
    vi.mocked(integrationsApi.listApiKeys).mockResolvedValue({ data: [apiKey] });
    vi.mocked(integrationsApi.deleteApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ApiKeysPage />);
    await screen.findByText("Zapier");

    await user.click(screen.getByRole("button", { name: "Révoquer" }));

    await waitFor(() => expect(screen.queryByText("Zapier")).not.toBeInTheDocument());
  });
});
