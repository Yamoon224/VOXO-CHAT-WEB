import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssistantSettingsForm } from "@/features/assistant/components/AssistantSettingsForm";
import type { AssistantSettings } from "@/features/assistant/types";

const settings: AssistantSettings = {
  enabled: true,
  tone_instructions: null,
  confidence_threshold: 0.6,
};

describe("AssistantSettingsForm", () => {
  it("enregistre les consignes modifiees", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AssistantSettingsForm settings={settings} update={update} />);

    await user.type(screen.getByLabelText("Ton et consignes"), "Sois bref.");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith({ enabled: true, tone_instructions: "Sois bref.", confidence_threshold: 0.6 });
  });

  it("peut desactiver l'agent", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AssistantSettingsForm settings={settings} update={update} />);

    await user.click(screen.getByLabelText("Agent IA activé"));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });
});
