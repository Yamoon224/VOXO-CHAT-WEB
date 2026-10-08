import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamPage } from "@/features/team/components/TeamPage";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { Member } from "@/features/team/types";

vi.mock("@/features/auth/api");
vi.mock("@/features/team/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const selfMember: Member = {
  id: "member-self",
  role: "workspace_admin",
  role_label: "Administrateur",
  joined_at: "2026-09-02T00:00:00Z",
  user: { id: "user-self", name: "Moi", email: "moi@example.test", last_login_at: null },
};

function mockSessionAs(permissions: string[]) {
  vi.mocked(authApi.me).mockResolvedValue({
    data: {
      user: {
        id: "user-self",
        name: "Moi",
        email: "moi@example.test",
        locale: "fr",
        email_verified: true,
        two_factor_enabled: false,
        is_platform_admin: false,
        last_login_at: null,
      },
      workspace: { id: "w1", name: "Acme", slug: "acme", role: "workspace_admin" },
      permissions,
      workspaces: [{ id: "w1", name: "Acme", slug: "acme", role: "workspace_admin" }],
    },
  });
}

function renderPage() {
  return render(
    <SessionProvider>
      <TeamPage />
    </SessionProvider>,
  );
}

describe("TeamPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche l'équipe et permet d'inviter quand l'appelant a members.manage", async () => {
    mockSessionAs(["members.view", "members.manage"]);
    vi.mocked(teamApi.listMembers).mockResolvedValue({
      data: [selfMember],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
    vi.mocked(teamApi.listInvitations).mockResolvedValue({ data: [] });
    vi.mocked(teamApi.inviteMember).mockResolvedValue({
      data: {
        id: "inv-1",
        email: "nouveau@example.test",
        role: "agent",
        role_label: "Agent",
        invited_by: "Moi",
        expires_at: "2026-10-14T00:00:00Z",
        created_at: "2026-10-07T00:00:00Z",
      },
    });

    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText("Moi", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("Inviter un coéquipier")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Adresse e-mail"), "nouveau@example.test");
    await user.click(screen.getByRole("button", { name: "Inviter" }));

    await waitFor(() => expect(screen.getByText("nouveau@example.test")).toBeInTheDocument());
  });

  it("masque la gestion de l'équipe sans members.manage", async () => {
    mockSessionAs(["members.view"]);
    vi.mocked(teamApi.listMembers).mockResolvedValue({
      data: [selfMember],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
    vi.mocked(teamApi.listInvitations).mockResolvedValue({ data: [] });

    renderPage();

    await screen.findByText("Membres");
    expect(screen.queryByText("Inviter un coéquipier")).not.toBeInTheDocument();
    expect(screen.queryByText("Invitations en attente")).not.toBeInTheDocument();
  });

  it("affiche une erreur si le chargement de l'équipe échoue", async () => {
    mockSessionAs(["members.view"]);
    vi.mocked(teamApi.listMembers).mockRejectedValue(
      new ApiError(403, "Vous n'avez pas les droits nécessaires pour cette action.", "forbidden"),
    );
    vi.mocked(teamApi.listInvitations).mockResolvedValue({ data: [] });

    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent("droits nécessaires");
  });
});
