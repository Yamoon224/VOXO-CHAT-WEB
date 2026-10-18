import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusSubscribersPage } from "@/features/status-page/components/StatusSubscribersPage";
import * as statusPageApi from "@/features/status-page/api";
import type { StatusSubscriber } from "@/features/status-page/types";

vi.mock("@/features/status-page/api");

const subscriber: StatusSubscriber = { id: "subscriber-1", email: "client@exemple.fr", created_at: "2026-10-18T00:00:00Z" };

describe("StatusSubscribersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les abonnes existants", async () => {
    vi.mocked(statusPageApi.listStatusSubscribers).mockResolvedValue({ data: [subscriber] });

    render(<StatusSubscribersPage />);

    expect(await screen.findByText("client@exemple.fr")).toBeInTheDocument();
  });

  it("retire un abonne", async () => {
    vi.mocked(statusPageApi.listStatusSubscribers).mockResolvedValue({ data: [subscriber] });
    vi.mocked(statusPageApi.deleteStatusSubscriber).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<StatusSubscribersPage />);
    await screen.findByText("client@exemple.fr");

    await user.click(screen.getByRole("button", { name: "Retirer" }));

    await waitFor(() => expect(screen.queryByText("client@exemple.fr")).not.toBeInTheDocument());
  });
});
