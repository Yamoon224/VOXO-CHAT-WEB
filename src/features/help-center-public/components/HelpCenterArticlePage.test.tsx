import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelpCenterArticlePage } from "@/features/help-center-public/components/HelpCenterArticlePage";
import * as helpCenterPublicApi from "@/features/help-center-public/api";

vi.mock("@/features/help-center-public/api");

describe("HelpCenterArticlePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche l'article publie", async () => {
    vi.mocked(helpCenterPublicApi.getArticle).mockResolvedValue({
      data: {
        id: "art-1",
        title: "Comment réinitialiser mon mot de passe",
        slug: "comment-reinitialiser-mon-mot-de-passe",
        locale: "fr",
        body: "Rendez-vous sur la page de connexion...",
        meta_description: null,
        category: { id: "cat-1", name: "Compte", slug: "compte" },
        published_at: "2026-10-14T00:00:00Z",
      },
    });

    render(<HelpCenterArticlePage workspaceId="workspace-1" slug="comment-reinitialiser-mon-mot-de-passe" />);

    expect(await screen.findByText("Comment réinitialiser mon mot de passe")).toBeInTheDocument();
    expect(screen.getByText("Rendez-vous sur la page de connexion...")).toBeInTheDocument();
    expect(screen.getByText("Compte")).toBeInTheDocument();
  });
});
