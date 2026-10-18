import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignDetailPage } from "@/features/campaigns/components/CampaignDetailPage";
import * as campaignsApi from "@/features/campaigns/api";
import type { Campaign, CampaignSend } from "@/features/campaigns/types";

vi.mock("@/features/campaigns/api");

const draftCampaign: Campaign = {
  id: "campaign-1",
  name: "Promotion automne",
  channel: "email",
  channel_label: "E-mail",
  segment_id: "segment-1",
  template_id: "template-1",
  status: "draft",
  status_label: "Brouillon",
  sent_at: null,
  created_at: null,
  stats: { pending: 0, sent: 0, failed: 0, skipped: 0 },
};

const send: CampaignSend = {
  id: "send-1",
  contact_id: "contact-1",
  contact_name: "Awa",
  contact_email: "awa@exemple.fr",
  status: "sent",
  status_label: "Envoyé",
  error: null,
  sent_at: "2026-10-18T00:00:00Z",
};

describe("CampaignDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les statistiques et les envois", async () => {
    vi.mocked(campaignsApi.getCampaign).mockResolvedValue({ data: draftCampaign });
    vi.mocked(campaignsApi.listCampaignSends).mockResolvedValue({ data: [send] });

    render(<CampaignDetailPage campaignId="campaign-1" />);

    expect(await screen.findByText("Promotion automne")).toBeInTheDocument();
    expect(screen.getByText("Awa")).toBeInTheDocument();
  });

  it("envoie la campagne depuis le detail", async () => {
    vi.mocked(campaignsApi.getCampaign)
      .mockResolvedValueOnce({ data: draftCampaign })
      .mockResolvedValueOnce({
        data: { ...draftCampaign, status: "sent", status_label: "Envoyée", stats: { pending: 0, sent: 1, failed: 0, skipped: 0 } },
      });
    vi.mocked(campaignsApi.listCampaignSends).mockResolvedValue({ data: [] });
    vi.mocked(campaignsApi.sendCampaign).mockResolvedValue({ data: draftCampaign });
    const user = userEvent.setup();

    render(<CampaignDetailPage campaignId="campaign-1" />);
    await screen.findByRole("button", { name: "Envoyer" });

    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => expect(screen.queryByRole("button", { name: "Envoyer" })).not.toBeInTheDocument());
  });
});
