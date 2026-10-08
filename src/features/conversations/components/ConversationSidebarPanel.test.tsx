import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConversationSidebarPanel } from "@/features/conversations/components/ConversationSidebarPanel";
import type { Conversation } from "@/features/conversations/types";
import type { Member } from "@/features/team/types";

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
  needs_human: true,
  rating: null,
  rating_comment: null,
  last_message_at: null,
  resolved_at: null,
  created_at: "2026-10-09T00:00:00Z",
};

const members: Member[] = [
  { id: "mem-1", role: "agent", role_label: "Agent", joined_at: "2026-10-01T00:00:00Z", user: { id: "u-1", name: "Koné", email: "k@example.test", last_login_at: null } },
];

describe("ConversationSidebarPanel", () => {
  it("change le statut et l'affectation", async () => {
    const onChangeStatus = vi.fn();
    const onAssign = vi.fn();
    const user = userEvent.setup();

    render(
      <ConversationSidebarPanel
        conversation={conversation}
        members={members}
        canManage
        onChangeStatus={onChangeStatus}
        onAssign={onAssign}
        onSummarize={vi.fn()}
        onAnalyzeSentiment={vi.fn()}
      />,
    );

    expect(screen.getByText("Escaladée vers un humain")).toBeInTheDocument();

    const [statusSelect, assignmentSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(statusSelect, "resolved");
    await user.selectOptions(assignmentSelect, "u-1");

    expect(onChangeStatus).toHaveBeenCalledWith("resolved");
    expect(onAssign).toHaveBeenCalledWith("u-1");
  });

  it("déclenche le résumé et l'analyse de sentiment", async () => {
    const onSummarize = vi.fn();
    const onAnalyzeSentiment = vi.fn();
    const user = userEvent.setup();

    render(
      <ConversationSidebarPanel
        conversation={conversation}
        members={members}
        canManage
        onChangeStatus={vi.fn()}
        onAssign={vi.fn()}
        onSummarize={onSummarize}
        onAnalyzeSentiment={onAnalyzeSentiment}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Résumer" }));
    await user.click(screen.getByRole("button", { name: "Analyser le sentiment" }));

    expect(onSummarize).toHaveBeenCalled();
    expect(onAnalyzeSentiment).toHaveBeenCalled();
  });

  it("désactive les contrôles sans la permission de gestion", () => {
    render(
      <ConversationSidebarPanel
        conversation={conversation}
        members={members}
        canManage={false}
        onChangeStatus={vi.fn()}
        onAssign={vi.fn()}
        onSummarize={vi.fn()}
        onAnalyzeSentiment={vi.fn()}
      />,
    );

    const selects = screen.getAllByRole("combobox");
    selects.forEach((select) => expect(select).toBeDisabled());
    expect(screen.queryByRole("button", { name: "Résumer" })).not.toBeInTheDocument();
  });
});
