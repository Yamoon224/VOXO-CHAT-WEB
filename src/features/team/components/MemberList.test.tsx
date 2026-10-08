import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemberList } from "@/features/team/components/MemberList";
import type { Member } from "@/features/team/types";

const owner: Member = {
  id: "member-owner",
  role: "workspace_owner",
  role_label: "Propriétaire",
  joined_at: "2026-09-01T00:00:00Z",
  user: { id: "user-owner", name: "Awa", email: "awa@example.test", last_login_at: null },
};

const self: Member = {
  id: "member-self",
  role: "workspace_admin",
  role_label: "Administrateur",
  joined_at: "2026-09-02T00:00:00Z",
  user: { id: "user-self", name: "Moi", email: "moi@example.test", last_login_at: null },
};

const other: Member = {
  id: "member-other",
  role: "viewer",
  role_label: "Lecteur",
  joined_at: "2026-09-03T00:00:00Z",
  user: { id: "user-other", name: "Kofi", email: "kofi@example.test", last_login_at: null },
};

describe("MemberList", () => {
  it("n'expose pas d'action sur le propriétaire ni sur l'appelant", () => {
    render(
      <MemberList members={[owner, self, other]} currentUserId="user-self" onChangeRole={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getByText("Propriétaire")).toBeInTheDocument();
    expect(screen.queryByLabelText("Rôle de Awa")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Rôle de Moi")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Rôle de Kofi")).toBeInTheDocument();
  });

  it("change le rôle d'un membre modifiable", async () => {
    const onChangeRole = vi.fn();
    const user = userEvent.setup();

    render(<MemberList members={[other]} currentUserId="user-self" onChangeRole={onChangeRole} onRemove={vi.fn()} />);

    await user.selectOptions(screen.getByLabelText("Rôle de Kofi"), "agent");

    expect(onChangeRole).toHaveBeenCalledWith("member-other", "agent");
  });

  it("retire un membre modifiable", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();

    render(<MemberList members={[other]} currentUserId="user-self" onChangeRole={vi.fn()} onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: "Retirer" }));

    expect(onRemove).toHaveBeenCalledWith("member-other");
  });
});
