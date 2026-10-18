import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage";
import * as analyticsApi from "@/features/analytics/api";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { AnalyticsOverview } from "@/features/analytics/types";

vi.mock("@/features/analytics/api");
vi.mock("@/features/team/api");

const overview: AnalyticsOverview = {
  from: "2026-09-09T00:00:00Z",
  to: "2026-10-09T00:00:00Z",
  conversation_count: 12,
  message_count: 48,
  average_rating: 4.5,
  ai_resolved_count: 8,
  escalated_count: 3,
  unanswered_count: 1,
  average_first_response_seconds: 125,
  average_resolution_seconds: 3600,
  messages_by_agent: [{ user_id: "user-1", count: 5 }],
  conversations_by_channel: [{ channel: "widget", count: 9 }, { channel: "email", count: 3 }],
  top_cited_documents: [{ title: "Politique de remboursement", count: 4 }],
  unanswered_knowledge_questions_count: 2,
  recent_unanswered_knowledge_questions: [{ question: "Livrez-vous sur Mars ?", created_at: "2026-10-05T00:00:00Z" }],
};

describe("AnalyticsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teamApi.listMembers).mockResolvedValue({
      data: [{ id: "member-1", role: "agent", role_label: "Agent", joined_at: "2026-10-09T00:00:00Z", user: { id: "user-1", name: "Awa", email: "awa@exemple.fr", last_login_at: null } }],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
  });

  it("affiche les statistiques de la période", async () => {
    vi.mocked(analyticsApi.getOverview).mockResolvedValue({ data: overview });

    render(<AnalyticsPage />);

    expect(await screen.findByText("12")).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("affiche les delais moyens de reponse et de resolution", async () => {
    vi.mocked(analyticsApi.getOverview).mockResolvedValue({ data: overview });

    render(<AnalyticsPage />);

    expect(await screen.findByText("2 min")).toBeInTheDocument();
    expect(screen.getByText("1 h")).toBeInTheDocument();
  });

  it("affiche l activite par agent et par canal", async () => {
    vi.mocked(analyticsApi.getOverview).mockResolvedValue({ data: overview });

    render(<AnalyticsPage />);

    expect(await screen.findByText("Awa")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
  });

  it("affiche les sujets frequents et les questions sans reponse", async () => {
    vi.mocked(analyticsApi.getOverview).mockResolvedValue({ data: overview });

    render(<AnalyticsPage />);

    expect(await screen.findByText("Politique de remboursement")).toBeInTheDocument();
    expect(screen.getByText("Livrez-vous sur Mars ?")).toBeInTheDocument();
  });

  it("masque une carte depuis les reglages du tableau de bord", async () => {
    vi.mocked(analyticsApi.getOverview).mockResolvedValue({ data: overview });

    render(<AnalyticsPage />);
    await screen.findByText("Awa");

    screen.getByLabelText("Activité par agent").click();

    expect(screen.queryByText("Awa")).not.toBeInTheDocument();
  });

  it("affiche une erreur si le chargement échoue", async () => {
    vi.mocked(analyticsApi.getOverview).mockRejectedValue(new ApiError(403, "Accès refusé.", "forbidden"));

    render(<AnalyticsPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Accès refusé.");
  });
});
