import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChannelEmailSettingsForm } from "@/features/channels/components/ChannelEmailSettingsForm";
import type { ChannelEmailSettings } from "@/features/channels/types";

const settings: ChannelEmailSettings = {
  enabled: false,
  reply_from_email: null,
  reply_from_name: null,
};

describe("ChannelEmailSettingsForm", () => {
  it("enregistre les reglages modifies", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ChannelEmailSettingsForm settings={settings} update={update} />);

    await user.click(screen.getByLabelText("Canal e-mail activé"));
    await user.type(screen.getByLabelText("Adresse d'envoi"), "support@exemple.fr");
    await user.type(screen.getByLabelText("Nom d'expéditeur"), "Support Exemple");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith({
      enabled: true,
      reply_from_email: "support@exemple.fr",
      reply_from_name: "Support Exemple",
    });
  });

  it("envoie des champs nuls quand ils sont vides", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ChannelEmailSettingsForm settings={settings} update={update} />);

    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith({ enabled: false, reply_from_email: null, reply_from_name: null });
  });
});
