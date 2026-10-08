import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssistantSettingsPage } from "@/features/assistant/components/AssistantSettingsPage";
import * as assistantApi from "@/features/assistant/api";

vi.mock("@/features/assistant/api");

describe("AssistantSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les reglages et permet de tester le bac a sable", async () => {
    vi.mocked(assistantApi.getSettings).mockResolvedValue({
      data: { enabled: true, tone_instructions: null, confidence_threshold: 0.6 },
    });
    vi.mocked(assistantApi.sandbox).mockResolvedValue({
      data: { content: "Réponse de démonstration.", citations: [], confidence: 0.9 },
    });
    const user = userEvent.setup();

    render(<AssistantSettingsPage />);

    expect(await screen.findByLabelText("Agent IA activé")).toBeChecked();

    await user.type(screen.getByLabelText("Message de test"), "Bonjour ?");
    await user.click(screen.getByRole("button", { name: "Tester" }));

    expect(await screen.findByText("Réponse de démonstration.")).toBeInTheDocument();
  });
});
