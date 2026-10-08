import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SandboxPanel } from "@/features/assistant/components/SandboxPanel";

describe("SandboxPanel", () => {
  it("teste l'agent et affiche la reponse simulee", async () => {
    const onTest = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <SandboxPanel
        reply={{ content: "Réponse de démonstration.", citations: [{ title: "FAQ", content: "...", citation_url: null }], confidence: 0.9 }}
        error={null}
        isTesting={false}
        onTest={onTest}
      />,
    );

    await user.type(screen.getByLabelText("Message de test"), "Quels sont vos horaires ?");
    await user.click(screen.getByRole("button", { name: "Tester" }));

    expect(onTest).toHaveBeenCalledWith("Quels sont vos horaires ?");
    expect(screen.getByText("Réponse de démonstration.")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
  });

  it("n'appelle pas le test pour un message vide", async () => {
    const onTest = vi.fn();
    const user = userEvent.setup();

    render(<SandboxPanel reply={null} error={null} isTesting={false} onTest={onTest} />);

    await user.click(screen.getByRole("button", { name: "Tester" }));

    expect(onTest).not.toHaveBeenCalled();
  });
});
