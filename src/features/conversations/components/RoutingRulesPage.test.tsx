import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoutingRulesPage } from "@/features/conversations/components/RoutingRulesPage";
import * as conversationsApi from "@/features/conversations/api";
import * as teamApi from "@/features/team/api";
import type { RoutingRule } from "@/features/conversations/types";

vi.mock("@/features/conversations/api");
vi.mock("@/features/team/api");

const rule: RoutingRule = {
  id: "rule-1",
  name: "Facturation",
  position: 0,
  is_active: true,
  conditions: [{ field: "message", operator: "contains", value: "facture" }],
  action_type: "assign_user",
  action_type_label: "Affecter à un agent",
  assignee_user_ids: ["user-1"],
};

describe("RoutingRulesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teamApi.listMembers).mockResolvedValue({
      data: [{ id: "member-1", role: "agent", role_label: "Agent", joined_at: "2026-10-09T00:00:00Z", user: { id: "user-1", name: "Awa", email: "awa@exemple.fr", last_login_at: null } }],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
  });

  it("liste les regles existantes", async () => {
    vi.mocked(conversationsApi.listRoutingRules).mockResolvedValue({ data: [rule] });

    render(<RoutingRulesPage />);

    expect(await screen.findByText("Facturation")).toBeInTheDocument();
  });

  it("cree une nouvelle regle", async () => {
    vi.mocked(conversationsApi.listRoutingRules).mockResolvedValue({ data: [] });
    vi.mocked(conversationsApi.createRoutingRule).mockResolvedValue({ data: { ...rule, id: "rule-2", name: "Urgences" } });
    const user = userEvent.setup();

    render(<RoutingRulesPage />);
    await screen.findByText("Aucune règle");

    await user.type(screen.getByLabelText("Nom de la règle"), "Urgences");
    await user.click(screen.getByLabelText("Awa"));
    await user.click(screen.getByRole("button", { name: "Créer la règle" }));

    await waitFor(() => expect(screen.getByText("Urgences")).toBeInTheDocument());
    expect(conversationsApi.createRoutingRule).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Urgences", assignee_user_ids: ["user-1"] }),
    );
  });

  it("supprime une regle", async () => {
    vi.mocked(conversationsApi.listRoutingRules).mockResolvedValue({ data: [rule] });
    vi.mocked(conversationsApi.deleteRoutingRule).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<RoutingRulesPage />);
    await screen.findByText("Facturation");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Facturation")).not.toBeInTheDocument());
  });
});
