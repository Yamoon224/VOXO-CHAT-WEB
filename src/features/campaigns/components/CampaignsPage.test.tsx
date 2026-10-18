import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignsPage } from "@/features/campaigns/components/CampaignsPage";
import * as campaignsApi from "@/features/campaigns/api";
import * as contactsApi from "@/features/contacts/api";
import type { Campaign, CampaignTemplate } from "@/features/campaigns/types";

vi.mock("@/features/campaigns/api");
vi.mock("@/features/contacts/api");

const campaign: Campaign = {
  id: "campaign-1",
  name: "Promotion automne",
  channel: "email",
  channel_label: "E-mail",
  segment_id: "segment-1",
  template_id: "template-1",
  status: "draft",
  status_label: "Brouillon",
  sent_at: null,
  created_at: "2026-10-18T00:00:00Z",
  stats: { pending: 0, sent: 0, failed: 0, skipped: 0 },
};

const template: CampaignTemplate = {
  id: "template-1",
  name: "Relance",
  channel: "email",
  channel_label: "E-mail",
  subject: "Bonjour {{name}}",
  body: "Contenu",
  created_at: null,
};

describe("CampaignsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(contactsApi.listSegments).mockResolvedValue({ data: [{ id: "segment-1", name: "Clients actifs", criteria: [] }] });
    vi.mocked(campaignsApi.listCampaignTemplates).mockResolvedValue({ data: [template] });
  });

  it("liste les campagnes existantes", async () => {
    vi.mocked(campaignsApi.listCampaigns).mockResolvedValue({ data: [campaign] });

    render(<CampaignsPage />);

    expect(await screen.findByText("Promotion automne")).toBeInTheDocument();
    expect(screen.getByText("Brouillon")).toBeInTheDocument();
  });

  it("cree une nouvelle campagne", async () => {
    vi.mocked(campaignsApi.listCampaigns).mockResolvedValue({ data: [] });
    vi.mocked(campaignsApi.createCampaign).mockResolvedValue({ data: { ...campaign, id: "campaign-2", name: "Nouvelle" } });
    const user = userEvent.setup();

    render(<CampaignsPage />);
    await screen.findByText("Aucune campagne");

    await user.type(screen.getByLabelText("Nom de la campagne"), "Nouvelle");
    await user.selectOptions(screen.getByLabelText("Segment ciblé"), "segment-1");
    await user.selectOptions(screen.getByLabelText("Modèle"), "template-1");
    await user.click(screen.getByRole("button", { name: "Créer la campagne" }));

    await waitFor(() => expect(screen.getByText("Nouvelle")).toBeInTheDocument());
  });

  it("envoie une campagne en brouillon", async () => {
    vi.mocked(campaignsApi.listCampaigns).mockResolvedValue({ data: [campaign] });
    vi.mocked(campaignsApi.sendCampaign).mockResolvedValue({
      data: { ...campaign, status: "sent", status_label: "Envoyée", stats: { pending: 0, sent: 1, failed: 0, skipped: 0 } },
    });
    const user = userEvent.setup();

    render(<CampaignsPage />);
    await screen.findByText("Promotion automne");

    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => expect(screen.getByText("Envoyée")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Envoyer" })).not.toBeInTheDocument();
  });

  it("supprime une campagne", async () => {
    vi.mocked(campaignsApi.listCampaigns).mockResolvedValue({ data: [campaign] });
    vi.mocked(campaignsApi.deleteCampaign).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CampaignsPage />);
    await screen.findByText("Promotion automne");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Promotion automne")).not.toBeInTheDocument());
  });
});
