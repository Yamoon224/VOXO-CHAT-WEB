import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConversationListPage } from "@/features/conversations/components/ConversationListPage";
import * as conversationsApi from "@/features/conversations/api";
import * as teamApi from "@/features/team/api";
import type { Conversation } from "@/features/conversations/types";

vi.mock("@/features/conversations/api");
vi.mock("@/features/team/api");

const conversation: Conversation = {
  id: "conv-1",
  channel: "widget",
  channel_label: "Widget",
  status: "open",
  status_label: "Ouverte",
  visitor_name: "Awa",
  visitor_email: null,
  assigned_user: null,
  subject: null,
  summary: null,
  sentiment: null,
  needs_human: false,
  rating: null,
  rating_comment: null,
  last_message_at: "2026-10-09T10:00:00Z",
  resolved_at: null,
  created_at: "2026-10-09T09:00:00Z",
};

describe("ConversationListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(conversationsApi.listInboxViews).mockResolvedValue({ data: [] });
    vi.mocked(teamApi.listMembers).mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 },
    });
  });

  it("affiche la liste des conversations", async () => {
    vi.mocked(conversationsApi.listConversations).mockResolvedValue({
      data: [conversation],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });

    render(<ConversationListPage />);

    expect(await screen.findByText("Awa")).toBeInTheDocument();
  });

  it("filtre par statut", async () => {
    vi.mocked(conversationsApi.listConversations).mockResolvedValue({
      data: [conversation],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
    const user = userEvent.setup();

    render(<ConversationListPage />);
    await screen.findByText("Awa");

    await user.selectOptions(screen.getByLabelText("Statut"), "resolved");

    await waitFor(() =>
      expect(conversationsApi.listConversations).toHaveBeenLastCalledWith({
        status: "resolved",
        needsHuman: undefined,
        channel: "",
        assignedUserId: undefined,
      }),
    );
  });

  it("affiche un etat vide sans conversation", async () => {
    vi.mocked(conversationsApi.listConversations).mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 },
    });

    render(<ConversationListPage />);

    expect(await screen.findByText("Aucune conversation")).toBeInTheDocument();
  });

  it("enregistre les filtres courants comme une sous-boite", async () => {
    vi.mocked(conversationsApi.listConversations).mockResolvedValue({
      data: [conversation],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
    vi.mocked(conversationsApi.createInboxView).mockResolvedValue({
      data: { id: "view-1", name: "Mes tickets", position: 0, filters: {} },
    });
    const user = userEvent.setup();

    render(<ConversationListPage />);
    await screen.findByText("Awa");

    await user.click(screen.getByRole("button", { name: "+ Enregistrer la vue courante" }));
    await user.type(screen.getByLabelText("Nom de la vue"), "Mes tickets");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(conversationsApi.createInboxView).toHaveBeenCalledWith("Mes tickets", {}, 0);
    expect(await screen.findByRole("button", { name: "Mes tickets" })).toBeInTheDocument();
  });
});
