import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChannelEmailSettingsPage } from "@/features/channels/components/ChannelEmailSettingsPage";
import * as channelsApi from "@/features/channels/api";

vi.mock("@/features/channels/api");

describe("ChannelEmailSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les reglages du canal e-mail", async () => {
    vi.mocked(channelsApi.getEmailSettings).mockResolvedValue({
      data: { enabled: true, reply_from_email: "support@exemple.fr", reply_from_name: "Support Exemple" },
    });

    render(<ChannelEmailSettingsPage />);

    expect(await screen.findByDisplayValue("support@exemple.fr")).toBeInTheDocument();
    expect(screen.getByLabelText("Canal e-mail activé")).toBeChecked();
  });
});
