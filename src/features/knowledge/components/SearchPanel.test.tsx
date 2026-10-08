import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchPanel } from "@/features/knowledge/components/SearchPanel";

describe("SearchPanel", () => {
  it("lance une recherche et affiche les passages trouvés", async () => {
    const onSearch = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <SearchPanel
        results={[
          { document_id: "doc-1", document_title: "Tarifs", chunk_content: "29€ par mois.", score: 0.91, citation_url: null },
        ]}
        error={null}
        isSearching={false}
        onSearch={onSearch}
      />,
    );

    await user.type(screen.getByLabelText("Question"), "Quel est le prix ?");
    await user.click(screen.getByRole("button", { name: "Rechercher" }));

    expect(onSearch).toHaveBeenCalledWith("Quel est le prix ?");
    expect(screen.getByText("Tarifs")).toBeInTheDocument();
    expect(screen.getByText("29€ par mois.")).toBeInTheDocument();
  });

  it("affiche un etat vide quand aucun passage n'est trouvé", () => {
    render(<SearchPanel results={[]} error={null} isSearching={false} onSearch={vi.fn()} />);

    expect(screen.getByText("Aucun passage trouvé")).toBeInTheDocument();
  });
});
