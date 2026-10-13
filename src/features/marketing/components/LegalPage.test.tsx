import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalPage } from "@/features/marketing/components/LegalPage";

describe("LegalPage", () => {
  it("affiche les sections légales et l'avertissement de contenu provisoire", () => {
    render(<LegalPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Mentions légales" })).toBeInTheDocument();
    expect(screen.getByText(/conseil juridique/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Données personnelles" })).toBeInTheDocument();
  });
});
