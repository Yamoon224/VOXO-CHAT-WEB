import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "@/features/marketing/components/HomePage";

describe("HomePage", () => {
  it("affiche le titre et les appels à l'action", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Essayer gratuitement" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Voir les tarifs" })).toHaveAttribute("href", "/tarifs");
  });

  it("montre la transcription d'exemple avec sa citation", () => {
    render(<HomePage />);

    expect(screen.getByText(/Politique de remboursement/)).toBeInTheDocument();
    expect(screen.getByText("Transmis à Claire")).toBeInTheDocument();
  });
});
