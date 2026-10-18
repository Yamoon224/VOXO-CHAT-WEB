import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PublicStatusPage } from "@/features/status-page-public/components/PublicStatusPage";
import * as statusPagePublicApi from "@/features/status-page-public/api";
import type { PublicStatusOverview } from "@/features/status-page-public/types";

vi.mock("@/features/status-page-public/api");

const overview: PublicStatusOverview = {
  probes: [{ id: "probe-1", name: "API", status: "up", status_label: "Opérationnel", uptime_ratio: 0.999 }],
  ongoing_incidents: [
    {
      id: "incident-1",
      title: "Latence élevée",
      status: "investigating",
      status_label: "En investigation",
      impact: "major",
      impact_label: "Majeur",
      started_at: "2026-10-18T00:00:00Z",
      resolved_at: null,
      updates: [{ id: "update-1", status: "investigating", status_label: "En investigation", body: "Nous investiguons.", created_at: null }],
    },
  ],
  upcoming_maintenances: [],
};

describe("PublicStatusPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les systemes et les incidents en cours", async () => {
    vi.mocked(statusPagePublicApi.getOverview).mockResolvedValue({ data: overview });

    render(<PublicStatusPage workspaceId="workspace-1" />);

    expect(await screen.findByText("API")).toBeInTheDocument();
    expect(screen.getByText("Latence élevée")).toBeInTheDocument();
    expect(screen.getByText("Nous investiguons.")).toBeInTheDocument();
    expect(screen.getByText("Certains systèmes sont actuellement affectés.")).toBeInTheDocument();
  });

  it("affiche tout operationnel sans incident", async () => {
    vi.mocked(statusPagePublicApi.getOverview).mockResolvedValue({
      data: { probes: [overview.probes[0]], ongoing_incidents: [], upcoming_maintenances: [] },
    });

    render(<PublicStatusPage workspaceId="workspace-1" />);

    expect(await screen.findByText("Tous les systèmes sont opérationnels.")).toBeInTheDocument();
  });

  it("permet de s abonner aux alertes", async () => {
    vi.mocked(statusPagePublicApi.getOverview).mockResolvedValue({ data: overview });
    vi.mocked(statusPagePublicApi.subscribe).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<PublicStatusPage workspaceId="workspace-1" />);
    await screen.findByText("API");

    await user.type(screen.getByLabelText("E-mail"), "client@exemple.fr");
    await user.click(screen.getByRole("button", { name: "S'abonner" }));

    await waitFor(() => expect(screen.getByText("Inscription enregistrée.")).toBeInTheDocument());
    expect(statusPagePublicApi.subscribe).toHaveBeenCalledWith("workspace-1", "client@exemple.fr");
  });
});
