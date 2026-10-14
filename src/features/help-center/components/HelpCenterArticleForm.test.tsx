import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpCenterArticleForm } from "@/features/help-center/components/HelpCenterArticleForm";
import * as helpCenterApi from "@/features/help-center/api";
import type { HelpCenterArticle, HelpCenterCategory } from "@/features/help-center/types";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));
vi.mock("@/features/help-center/api");

const category: HelpCenterCategory = { id: "cat-1", name: "Facturation", slug: "facturation", locale: "fr", position: 0 };

const article: HelpCenterArticle = {
  id: "art-1",
  title: "Titre existant",
  slug: "titre-existant",
  locale: "fr",
  body: "Corps existant.",
  status: "draft",
  status_label: "Brouillon",
  meta_description: null,
  position: 0,
  category: null,
  published_at: null,
  created_at: "2026-10-14T00:00:00Z",
};

describe("HelpCenterArticleForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cree un nouvel article puis redirige vers la liste", async () => {
    vi.mocked(helpCenterApi.listCategories).mockResolvedValue({ data: [category] });
    vi.mocked(helpCenterApi.createArticle).mockResolvedValue({ data: { ...article, title: "Nouveau titre" } });
    const user = userEvent.setup();

    render(<HelpCenterArticleForm />);

    await user.type(await screen.findByLabelText("Titre"), "Nouveau titre");
    await user.type(screen.getByLabelText("Contenu"), "Nouveau corps.");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() =>
      expect(helpCenterApi.createArticle).toHaveBeenCalledWith({
        title: "Nouveau titre",
        category_id: null,
        locale: "fr",
        body: "Nouveau corps.",
        status: "draft",
        meta_description: null,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/settings/help-center");
  });

  it("pre-remplit le formulaire en modification", async () => {
    vi.mocked(helpCenterApi.listCategories).mockResolvedValue({ data: [category] });
    vi.mocked(helpCenterApi.getArticle).mockResolvedValue({ data: article });

    render(<HelpCenterArticleForm articleId="art-1" />);

    expect(await screen.findByDisplayValue("Titre existant")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Corps existant.")).toBeInTheDocument();
  });
});
