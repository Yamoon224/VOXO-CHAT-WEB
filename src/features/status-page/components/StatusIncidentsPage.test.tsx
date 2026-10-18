import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusIncidentsPage } from "@/features/status-page/components/StatusIncidentsPage";
import * as statusPageApi from "@/features/status-page/api";
import type { StatusIncident } from "@/features/status-page/types";

vi.mock("@/features/status-page/api");

const incident: StatusIncident = {
  id: "incident-1",
  title: "Latence élevée",
  status: "investigating",
  status_label: "En investigation",
  impact: "major",
  impact_label: "Majeur",
  started_at: "2026-10-18T00:00:00Z",
  resolved_at: null,
};

describe("StatusIncidentsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les incidents existants", async () => {
    vi.mocked(statusPageApi.listStatusIncidents).mockResolvedValue({ data: [incident] });

    render(<StatusIncidentsPage />);

    expect(await screen.findByText("Latence élevée")).toBeInTheDocument();
  });

  it("ouvre un nouvel incident", async () => {
    vi.mocked(statusPageApi.listStatusIncidents).mockResolvedValue({ data: [] });
    vi.mocked(statusPageApi.createStatusIncident).mockResolvedValue({ data: { ...incident, id: "incident-2", title: "Panne" } });
    const user = userEvent.setup();

    render(<StatusIncidentsPage />);
    await screen.findByText("Aucun incident");

    await user.type(screen.getByLabelText("Titre"), "Panne");
    await user.type(screen.getByLabelText("Message"), "Panne détectée.");
    await user.click(screen.getByRole("button", { name: "Ouvrir l'incident" }));

    await waitFor(() => expect(screen.getByText("Panne")).toBeInTheDocument());
  });

  it("affiche la chronologie et ajoute une mise a jour", async () => {
    vi.mocked(statusPageApi.listStatusIncidents).mockResolvedValue({ data: [incident] });
    vi.mocked(statusPageApi.listStatusIncidentUpdates).mockResolvedValue({
      data: [{ id: "update-1", status: "investigating", status_label: "En investigation", body: "Nous investiguons.", created_at: null }],
    });
    vi.mocked(statusPageApi.addStatusIncidentUpdate).mockResolvedValue({ data: { ...incident, status: "resolved", status_label: "Résolu" } });
    const user = userEvent.setup();

    render(<StatusIncidentsPage />);
    await screen.findByText("Latence élevée");

    await user.click(screen.getByRole("button", { name: "Voir la chronologie" }));
    expect(await screen.findByText("Nous investiguons.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Message de la mise à jour"), "Tout va bien.");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() => expect(statusPageApi.addStatusIncidentUpdate).toHaveBeenCalled());
  });
});
