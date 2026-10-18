import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusMaintenancesPage } from "@/features/status-page/components/StatusMaintenancesPage";
import * as statusPageApi from "@/features/status-page/api";
import type { StatusMaintenance } from "@/features/status-page/types";

vi.mock("@/features/status-page/api");

const maintenance: StatusMaintenance = {
  id: "maintenance-1",
  title: "Mise à jour de la base",
  description: null,
  status: "scheduled",
  status_label: "Planifiée",
  scheduled_start: "2026-10-20T10:00:00Z",
  scheduled_end: "2026-10-20T12:00:00Z",
};

describe("StatusMaintenancesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les maintenances existantes", async () => {
    vi.mocked(statusPageApi.listStatusMaintenances).mockResolvedValue({ data: [maintenance] });

    render(<StatusMaintenancesPage />);

    expect(await screen.findByText("Mise à jour de la base")).toBeInTheDocument();
  });

  it("supprime une maintenance", async () => {
    vi.mocked(statusPageApi.listStatusMaintenances).mockResolvedValue({ data: [maintenance] });
    vi.mocked(statusPageApi.deleteStatusMaintenance).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<StatusMaintenancesPage />);
    await screen.findByText("Mise à jour de la base");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Mise à jour de la base")).not.toBeInTheDocument());
  });
});
