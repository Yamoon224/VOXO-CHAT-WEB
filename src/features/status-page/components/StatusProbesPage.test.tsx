import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusProbesPage } from "@/features/status-page/components/StatusProbesPage";
import * as statusPageApi from "@/features/status-page/api";
import type { StatusProbe } from "@/features/status-page/types";

vi.mock("@/features/status-page/api");

const probe: StatusProbe = {
  id: "probe-1",
  name: "API",
  url: "https://exemple.fr/health",
  check_interval_minutes: 5,
  status: "up",
  status_label: "Opérationnel",
  last_checked_at: "2026-10-18T00:00:00Z",
  consecutive_failures: 0,
};

describe("StatusProbesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les sondes existantes", async () => {
    vi.mocked(statusPageApi.listStatusProbes).mockResolvedValue({ data: [probe] });

    render(<StatusProbesPage />);

    expect(await screen.findByText("API")).toBeInTheDocument();
    expect(screen.getByText("Opérationnel")).toBeInTheDocument();
  });

  it("cree une nouvelle sonde", async () => {
    vi.mocked(statusPageApi.listStatusProbes).mockResolvedValue({ data: [] });
    vi.mocked(statusPageApi.createStatusProbe).mockResolvedValue({ data: { ...probe, id: "probe-2", name: "Site" } });
    const user = userEvent.setup();

    render(<StatusProbesPage />);
    await screen.findByText("Aucune sonde");

    await user.type(screen.getByLabelText("Nom"), "Site");
    await user.type(screen.getByLabelText("URL vérifiée"), "https://exemple.fr");
    await user.click(screen.getByRole("button", { name: "Ajouter la sonde" }));

    await waitFor(() => expect(screen.getByText("Site")).toBeInTheDocument());
  });

  it("supprime une sonde", async () => {
    vi.mocked(statusPageApi.listStatusProbes).mockResolvedValue({ data: [probe] });
    vi.mocked(statusPageApi.deleteStatusProbe).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<StatusProbesPage />);
    await screen.findByText("API");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("API")).not.toBeInTheDocument());
  });
});
