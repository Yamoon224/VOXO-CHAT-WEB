import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpCenterCategoriesSection } from "@/features/help-center/components/HelpCenterCategoriesSection";
import * as helpCenterApi from "@/features/help-center/api";
import type { HelpCenterCategory } from "@/features/help-center/types";

vi.mock("@/features/help-center/api");

const category: HelpCenterCategory = { id: "cat-1", name: "Facturation", slug: "facturation", locale: "fr", position: 0 };

describe("HelpCenterCategoriesSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les categories et en ajoute une nouvelle", async () => {
    vi.mocked(helpCenterApi.listCategories).mockResolvedValue({ data: [category] });
    vi.mocked(helpCenterApi.createCategory).mockResolvedValue({
      data: { id: "cat-2", name: "Compte", slug: "compte", locale: "fr", position: 1 },
    });
    const user = userEvent.setup();

    render(<HelpCenterCategoriesSection />);

    expect(await screen.findByText("Facturation")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Nom de la catégorie"), "Compte");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() => expect(screen.getByText("Compte")).toBeInTheDocument());
  });

  it("supprime une categorie", async () => {
    vi.mocked(helpCenterApi.listCategories).mockResolvedValue({ data: [category] });
    vi.mocked(helpCenterApi.deleteCategory).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<HelpCenterCategoriesSection />);
    await screen.findByText("Facturation");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Facturation")).not.toBeInTheDocument());
  });
});
