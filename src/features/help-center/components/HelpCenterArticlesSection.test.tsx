import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpCenterArticlesSection } from "@/features/help-center/components/HelpCenterArticlesSection";
import * as helpCenterApi from "@/features/help-center/api";
import type { HelpCenterArticle } from "@/features/help-center/types";

vi.mock("@/features/help-center/api");

const article: HelpCenterArticle = {
  id: "art-1",
  title: "Comment réinitialiser mon mot de passe",
  slug: "comment-reinitialiser-mon-mot-de-passe",
  locale: "fr",
  body: "Contenu.",
  status: "draft",
  status_label: "Brouillon",
  meta_description: null,
  position: 0,
  category: null,
  published_at: null,
  created_at: "2026-10-14T00:00:00Z",
};

describe("HelpCenterArticlesSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les articles de l'espace courant", async () => {
    vi.mocked(helpCenterApi.listArticles).mockResolvedValue({
      data: [article],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });

    render(<HelpCenterArticlesSection />);

    expect(await screen.findByText("Comment réinitialiser mon mot de passe")).toBeInTheDocument();
    expect(within(screen.getByRole("list")).getByText("Brouillon")).toBeInTheDocument();
  });

  it("supprime un article", async () => {
    vi.mocked(helpCenterApi.listArticles).mockResolvedValue({
      data: [article],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
    vi.mocked(helpCenterApi.deleteArticle).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<HelpCenterArticlesSection />);
    await screen.findByText("Comment réinitialiser mon mot de passe");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Comment réinitialiser mon mot de passe")).not.toBeInTheDocument());
  });
});
