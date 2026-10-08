import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { WidgetSettingsPage } from "@/features/widget/components/WidgetSettingsPage";
import * as widgetApi from "@/features/widget/api";

vi.mock("@/features/widget/api");

describe("WidgetSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les reglages et le script d'integration", async () => {
    vi.mocked(widgetApi.getSettings).mockResolvedValue({
      data: {
        primary_color: "#4F46E5",
        logo_url: null,
        position: "bottom_right",
        welcome_message: "Bonjour !",
        language: "fr",
        business_hours: null,
        offline_message: null,
      },
    });
    vi.mocked(widgetApi.getScript).mockResolvedValue({ data: { script: "<script>window.VoxoWidgetConfig</script>" } });

    render(<WidgetSettingsPage />);

    expect(await screen.findByDisplayValue("#4F46E5")).toBeInTheDocument();
    expect(screen.getByText(/VoxoWidgetConfig/)).toBeInTheDocument();
  });
});
