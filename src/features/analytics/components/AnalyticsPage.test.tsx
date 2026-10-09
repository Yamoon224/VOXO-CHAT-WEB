import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage";
import * as analyticsApi from "@/features/analytics/api";
import { ApiError } from "@/lib/api/errors";
import type { AnalyticsOverview } from "@/features/analytics/types";

vi.mock("@/features/analytics/api");

const overview: AnalyticsOverview = {
  from: "2026-09-09T00:00:00Z",
  to: "2026-10-09T00:00:00Z",
  conversation_count: 12,
  message_count: 48,
  average_rating: 4.5,
  ai_resolved_count: 8,
  escalated_count: 3,
  unanswered_count: 1,
};

describe("AnalyticsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les statistiques de la période", async () => {
    vi.mocked(analyticsApi.getOverview).mockResolvedValue({ data: overview });

    render(<AnalyticsPage />);

    expect(await screen.findByText("12")).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("affiche une erreur si le chargement échoue", async () => {
    vi.mocked(analyticsApi.getOverview).mockRejectedValue(new ApiError(403, "Accès refusé.", "forbidden"));

    render(<AnalyticsPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Accès refusé.");
  });
});
