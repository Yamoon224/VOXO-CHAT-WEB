import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WidgetSettingsForm } from "@/features/widget/components/WidgetSettingsForm";
import type { WidgetSettings } from "@/features/widget/types";

const settings: WidgetSettings = {
  primary_color: "#4F46E5",
  logo_url: null,
  position: "bottom_right",
  welcome_message: "Bonjour !",
  language: "fr",
  business_hours: null,
  offline_message: null,
};

describe("WidgetSettingsForm", () => {
  it("enregistre les reglages modifies", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<WidgetSettingsForm settings={settings} update={update} />);

    await user.clear(screen.getByLabelText("Couleur principale"));
    await user.type(screen.getByLabelText("Couleur principale"), "#112233");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ primary_color: "#112233", position: "bottom_right", business_hours: null }),
    );
  });

  it("active un creneau d'horaires et l'envoie dans business_hours", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<WidgetSettingsForm settings={settings} update={update} />);

    await user.click(screen.getByText("Lundi"));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ business_hours: [{ day: 1, opens_at: "09:00", closes_at: "18:00" }] }),
    );
  });
});
