import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChannelConnectionCard } from "@/features/channels/components/ChannelConnectionCard";
import type { ChannelConnection } from "@/features/channels/types";

const telegramConnection: ChannelConnection = { channel: "telegram", enabled: false, credentials: {} };

describe("ChannelConnectionCard", () => {
  it("n'envoie que les identifiants retapes", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ChannelConnectionCard channel="telegram" connection={telegramConnection} update={update} />);

    await user.click(screen.getByLabelText("Canal Telegram activé"));
    await user.type(screen.getByLabelText("Jeton du bot"), "123456:abcdefghijklmnop");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith("telegram", {
      enabled: true,
      credentials: { bot_token: "123456:abcdefghijklmnop" },
    });
  });

  it("n'inclut pas la cle credentials quand rien n'a ete retape", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    const alreadyConfigured: ChannelConnection = { channel: "telegram", enabled: false, credentials: { bot_token: "••••mnop" } };

    render(<ChannelConnectionCard channel="telegram" connection={alreadyConfigured} update={update} />);

    await user.click(screen.getByLabelText("Canal Telegram activé"));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith("telegram", { enabled: true });
  });

  it("affiche le jeton de verification Meta pour WhatsApp", () => {
    const whatsApp: ChannelConnection = {
      channel: "whatsapp",
      enabled: false,
      credentials: { verify_token: "abc123" },
    };

    render(<ChannelConnectionCard channel="whatsapp" connection={whatsApp} update={vi.fn()} />);

    expect(screen.getByText("abc123")).toBeInTheDocument();
  });
});
