import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChannelConnectionsPage } from "@/features/channels/components/ChannelConnectionsPage";
import * as channelsApi from "@/features/channels/api";
import { MESSAGING_CHANNELS } from "@/features/channels/types";

vi.mock("@/features/channels/api");

describe("ChannelConnectionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(channelsApi.getChannelConnection).mockImplementation((channel) =>
      Promise.resolve({ data: { channel, enabled: false, credentials: {} } }),
    );
  });

  it("affiche une carte par canal de messagerie", async () => {
    render(<ChannelConnectionsPage />);

    expect(await screen.findByText("WhatsApp")).toBeInTheDocument();
    for (const channel of MESSAGING_CHANNELS) {
      expect(channelsApi.getChannelConnection).toHaveBeenCalledWith(channel);
    }
    expect(screen.getByText("Messenger")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Telegram")).toBeInTheDocument();
    expect(screen.getByText("SMS")).toBeInTheDocument();
  });
});
