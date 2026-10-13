import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturesPage } from "@/features/marketing/components/FeaturesPage";

describe("FeaturesPage", () => {
  it("liste les sections de fonctionnalités", () => {
    render(<FeaturesPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Fonctionnalités" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Agent IA" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Boîte de réception partagée" })).toBeInTheDocument();
  });
});
