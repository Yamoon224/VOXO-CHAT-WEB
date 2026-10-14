import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelpCenterHomePage } from "@/features/help-center-public/components/HelpCenterHomePage";
import * as helpCenterPublicApi from "@/features/help-center-public/api";

vi.mock("@/features/help-center-public/api");

describe("HelpCenterHomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les categories et les articles publies", async () => {
    vi.mocked(helpCenterPublicApi.listCategories).mockResolvedValue({
      data: [{ id: "cat-1", name: "Facturation", slug: "facturation", locale: "fr", position: 0 }],
    });
    vi.mocked(helpCenterPublicApi.listArticles).mockResolvedValue({
      data: [
        {
          id: "art-1",
          title: "Comment réinitialiser mon mot de passe",
          slug: "comment-reinitialiser-mon-mot-de-passe",
          locale: "fr",
          body: "Contenu.",
          meta_description: "Un résumé.",
          category: null,
          published_at: "2026-10-14T00:00:00Z",
        },
      ],
    });

    render(<HelpCenterHomePage workspaceId="workspace-1" />);

    expect(await screen.findByText("Facturation")).toBeInTheDocument();
    expect(screen.getByText("Comment réinitialiser mon mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Comment réinitialiser mon mot de passe" })).toHaveAttribute(
      "href",
      "/help/workspace-1/articles/comment-reinitialiser-mon-mot-de-passe",
    );
  });
});
