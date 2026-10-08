import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConversationDetailPage } from "@/features/conversations/components/ConversationDetailPage";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import * as conversationsApi from "@/features/conversations/api";
import * as teamApi from "@/features/team/api";
import type { Conversation, Message } from "@/features/conversations/types";

vi.mock("@/features/auth/api");
vi.mock("@/features/conversations/api");
vi.mock("@/features/team/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const conversation: Conversation = {
  id: "conv-1",
  channel: "widget",
  channel_label: "Widget",
  status: "open",
  status_label: "Ouverte",
  visitor_name: "Awa",
  visitor_email: "awa@example.test",
  assigned_user: null,
  subject: null,
  summary: null,
  sentiment: null,
  needs_human: false,
  rating: null,
  rating_comment: null,
  last_message_at: null,
  resolved_at: null,
  created_at: "2026-10-09T00:00:00Z",
};

const visitorMessage: Message = {
  id: "m-1",
  sender_type: "visitor",
  sender_label: "Visiteur",
  sender_user: null,
  visibility: "public",
  body: "Quels sont vos horaires ?",
  citations: [],
  attachment_filename: null,
  created_at: "2026-10-09T00:00:00Z",
};

function mockSessionAs(permissions: string[]) {
  vi.mocked(authApi.me).mockResolvedValue({
    data: {
      user: { id: "user-self", name: "Moi", email: "moi@example.test", locale: "fr", email_verified: true, two_factor_enabled: false, is_platform_admin: false, last_login_at: null },
      workspace: { id: "w1", name: "Acme", slug: "acme", role: "workspace_admin" },
      permissions,
      workspaces: [{ id: "w1", name: "Acme", slug: "acme", role: "workspace_admin" }],
    },
  });
}

function mockLoads() {
  vi.mocked(conversationsApi.getConversation).mockResolvedValue({ data: conversation });
  vi.mocked(conversationsApi.listMessages).mockResolvedValue({ data: [visitorMessage] });
  vi.mocked(teamApi.listMembers).mockResolvedValue({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  vi.mocked(conversationsApi.listCannedResponses).mockResolvedValue({ data: [] });
}

describe("ConversationDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le fil et permet de repondre quand l'appelant gere les conversations", async () => {
    mockSessionAs(["conversations.view", "conversations.manage"]);
    mockLoads();
    vi.mocked(conversationsApi.postMessage).mockResolvedValue({
      data: { ...visitorMessage, id: "m-2", sender_type: "agent", body: "Nous sommes ouverts de 9h à 18h." },
    });
    const user = userEvent.setup();

    render(
      <SessionProvider>
        <ConversationDetailPage conversationId="conv-1" />
      </SessionProvider>,
    );

    expect(await screen.findByText("Quels sont vos horaires ?")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Message"), "Nous sommes ouverts de 9h à 18h.");
    await user.click(screen.getByRole("button", { name: "Répondre" }));

    await waitFor(() => expect(screen.getByText("Nous sommes ouverts de 9h à 18h.")).toBeInTheDocument());
  });

  it("masque le formulaire de reponse sans conversations.manage", async () => {
    mockSessionAs(["conversations.view"]);
    mockLoads();

    render(
      <SessionProvider>
        <ConversationDetailPage conversationId="conv-1" />
      </SessionProvider>,
    );

    await screen.findByText("Quels sont vos horaires ?");
    expect(screen.queryByLabelText("Message")).not.toBeInTheDocument();
  });
});
