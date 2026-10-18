import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { UnsubscribeStatusAlertsPage } from "@/features/status-page-public/components/UnsubscribeStatusAlertsPage";
import * as statusPagePublicApi from "@/features/status-page-public/api";
import { ApiError } from "@/lib/api/errors";

vi.mock("@/features/status-page-public/api");

describe("UnsubscribeStatusAlertsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("soumet le jeton automatiquement et affiche la confirmation", async () => {
    vi.mocked(statusPagePublicApi.unsubscribe).mockResolvedValue(undefined);

    render(<UnsubscribeStatusAlertsPage token="un-jeton" />);

    expect(await screen.findByText("Vous ne recevrez plus d'alertes de cette page de statut.")).toBeInTheDocument();
    expect(statusPagePublicApi.unsubscribe).toHaveBeenCalledWith("un-jeton");
  });

  it("affiche une erreur sans jeton, sans appeler l api", async () => {
    render(<UnsubscribeStatusAlertsPage token="" />);

    expect(await screen.findByText("Lien de désinscription invalide.")).toBeInTheDocument();
    expect(statusPagePublicApi.unsubscribe).not.toHaveBeenCalled();
  });

  it("affiche l erreur de l api", async () => {
    vi.mocked(statusPagePublicApi.unsubscribe).mockRejectedValue(new ApiError(422, "Jeton invalide.", "invalid_token"));

    render(<UnsubscribeStatusAlertsPage token="un-jeton" />);

    expect(await screen.findByText("Jeton invalide.")).toBeInTheDocument();
  });
});
