import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CannedResponsesPage } from "@/features/conversations/components/CannedResponsesPage";
import * as conversationsApi from "@/features/conversations/api";
import type { CannedResponse } from "@/features/conversations/types";

vi.mock("@/features/conversations/api");

const response: CannedResponse = { id: "cr-1", title: "Bienvenue", body: "Bonjour !", created_at: "2026-10-09T00:00:00Z" };

describe("CannedResponsesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les reponses et en ajoute une nouvelle", async () => {
    vi.mocked(conversationsApi.listCannedResponses).mockResolvedValue({ data: [response] });
    vi.mocked(conversationsApi.createCannedResponse).mockResolvedValue({
      data: { id: "cr-2", title: "Au revoir", body: "Merci !", created_at: "2026-10-09T00:01:00Z" },
    });
    const user = userEvent.setup();

    render(<CannedResponsesPage />);

    expect(await screen.findByText("Bienvenue")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Titre"), "Au revoir");
    await user.type(screen.getByLabelText("Texte"), "Merci !");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() => expect(screen.getByText("Au revoir")).toBeInTheDocument());
  });

  it("supprime une reponse", async () => {
    vi.mocked(conversationsApi.listCannedResponses).mockResolvedValue({ data: [response] });
    vi.mocked(conversationsApi.deleteCannedResponse).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CannedResponsesPage />);
    await screen.findByText("Bienvenue");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Bienvenue")).not.toBeInTheDocument());
  });
});
