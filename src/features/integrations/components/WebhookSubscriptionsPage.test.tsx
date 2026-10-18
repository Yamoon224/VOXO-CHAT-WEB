import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WebhookSubscriptionsPage } from "@/features/integrations/components/WebhookSubscriptionsPage";
import * as integrationsApi from "@/features/integrations/api";
import type { WebhookSubscription } from "@/features/integrations/types";

vi.mock("@/features/integrations/api");

const subscription: WebhookSubscription = {
  id: "sub-1",
  url: "https://exemple.fr/webhooks/voxo",
  secret: "s3cr3t",
  event_types: ["conversation.created"],
  enabled: true,
  created_at: "2026-10-17T00:00:00Z",
};

describe("WebhookSubscriptionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les abonnements existants", async () => {
    vi.mocked(integrationsApi.listWebhookSubscriptions).mockResolvedValue({ data: [subscription] });

    render(<WebhookSubscriptionsPage />);

    expect(await screen.findByText("https://exemple.fr/webhooks/voxo")).toBeInTheDocument();
    expect(screen.getByText("s3cr3t")).toBeInTheDocument();
  });

  it("cree un nouvel abonnement", async () => {
    vi.mocked(integrationsApi.listWebhookSubscriptions).mockResolvedValue({ data: [] });
    vi.mocked(integrationsApi.createWebhookSubscription).mockResolvedValue({
      data: { ...subscription, id: "sub-2", url: "https://exemple.fr/autre" },
    });
    const user = userEvent.setup();

    render(<WebhookSubscriptionsPage />);
    await screen.findByText("Aucun abonnement");

    await user.type(screen.getByLabelText("URL de destination"), "https://exemple.fr/autre");
    await user.click(screen.getByLabelText("Conversation créée"));
    await user.click(screen.getByRole("button", { name: "Ajouter l'abonnement" }));

    await waitFor(() => expect(screen.getByText("https://exemple.fr/autre")).toBeInTheDocument());
    expect(integrationsApi.createWebhookSubscription).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://exemple.fr/autre", event_types: ["conversation.created"] }),
    );
  });

  it("supprime un abonnement", async () => {
    vi.mocked(integrationsApi.listWebhookSubscriptions).mockResolvedValue({ data: [subscription] });
    vi.mocked(integrationsApi.deleteWebhookSubscription).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<WebhookSubscriptionsPage />);
    await screen.findByText("https://exemple.fr/webhooks/voxo");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("https://exemple.fr/webhooks/voxo")).not.toBeInTheDocument());
  });

  it("affiche l historique des livraisons", async () => {
    vi.mocked(integrationsApi.listWebhookSubscriptions).mockResolvedValue({ data: [subscription] });
    vi.mocked(integrationsApi.listWebhookDeliveries).mockResolvedValue({
      data: [{ id: "delivery-1", event_type: "conversation.created", status: "success", response_status: 200, attempted_at: null, created_at: null }],
    });
    const user = userEvent.setup();

    render(<WebhookSubscriptionsPage />);
    await screen.findByText("https://exemple.fr/webhooks/voxo");

    await user.click(screen.getByRole("button", { name: "Voir les livraisons" }));

    expect(await screen.findByText("Réussie")).toBeInTheDocument();
    expect(screen.getByText("HTTP 200")).toBeInTheDocument();
  });
});
