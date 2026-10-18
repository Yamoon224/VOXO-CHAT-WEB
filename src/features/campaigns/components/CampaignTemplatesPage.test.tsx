import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignTemplatesPage } from "@/features/campaigns/components/CampaignTemplatesPage";
import * as campaignsApi from "@/features/campaigns/api";
import type { CampaignTemplate } from "@/features/campaigns/types";

vi.mock("@/features/campaigns/api");

const template: CampaignTemplate = {
  id: "template-1",
  name: "Relance",
  channel: "email",
  channel_label: "E-mail",
  subject: "Bonjour {{name}}",
  body: "Contenu pour {{email}}",
  created_at: "2026-10-18T00:00:00Z",
};

describe("CampaignTemplatesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les modeles existants", async () => {
    vi.mocked(campaignsApi.listCampaignTemplates).mockResolvedValue({ data: [template] });

    render(<CampaignTemplatesPage />);

    expect(await screen.findByText("Relance")).toBeInTheDocument();
  });

  it("cree un nouveau modele", async () => {
    vi.mocked(campaignsApi.listCampaignTemplates).mockResolvedValue({ data: [] });
    vi.mocked(campaignsApi.createCampaignTemplate).mockResolvedValue({ data: { ...template, id: "template-2", name: "Bienvenue" } });
    const user = userEvent.setup();

    render(<CampaignTemplatesPage />);
    await screen.findByText("Aucun modèle");

    await user.type(screen.getByLabelText("Nom du modèle"), "Bienvenue");
    await user.type(screen.getByLabelText("Objet"), "Bonjour {{name}}");
    await user.type(screen.getByLabelText("Corps"), "Contenu");
    await user.click(screen.getByRole("button", { name: "Créer le modèle" }));

    await waitFor(() => expect(screen.getByText("Bienvenue")).toBeInTheDocument());
  });

  it("masque l objet pour le canal chat", async () => {
    vi.mocked(campaignsApi.listCampaignTemplates).mockResolvedValue({ data: [] });
    const user = userEvent.setup();

    render(<CampaignTemplatesPage />);
    await screen.findByText("Aucun modèle");

    await user.selectOptions(screen.getByLabelText("Canal"), "chat");

    expect(screen.queryByLabelText("Objet")).not.toBeInTheDocument();
  });

  it("supprime un modele", async () => {
    vi.mocked(campaignsApi.listCampaignTemplates).mockResolvedValue({ data: [template] });
    vi.mocked(campaignsApi.deleteCampaignTemplate).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CampaignTemplatesPage />);
    await screen.findByText("Relance");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Relance")).not.toBeInTheDocument());
  });
});
