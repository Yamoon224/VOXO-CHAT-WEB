import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkspaceSwitcher } from "@/features/workspace/components/WorkspaceSwitcher";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import * as workspaceApi from "@/features/workspace/api";

vi.mock("@/features/auth/api");
vi.mock("@/features/workspace/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const user = {
  id: "u1",
  name: "Awa",
  email: "awa@example.test",
  locale: "fr" as const,
  email_verified: true,
  two_factor_enabled: false,
  is_platform_admin: false,
  last_login_at: null,
};

function renderSwitcher() {
  return render(
    <SessionProvider>
      <WorkspaceSwitcher />
    </SessionProvider>,
  );
}

describe("WorkspaceSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("n'affiche qu'un nom quand il n'y a qu'un seul espace", async () => {
    vi.mocked(authApi.me).mockResolvedValue({
      data: {
        user,
        workspace: { id: "w1", name: "Acme", slug: "acme", role: "workspace_owner" },
        permissions: [],
        workspaces: [{ id: "w1", name: "Acme", slug: "acme", role: "workspace_owner" }],
      },
    });

    renderSwitcher();

    expect(await screen.findByText("Acme")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("bascule l'espace courant quand il y en a plusieurs", async () => {
    vi.mocked(authApi.me).mockResolvedValue({
      data: {
        user,
        workspace: { id: "w1", name: "Acme", slug: "acme", role: "workspace_owner" },
        permissions: [],
        workspaces: [
          { id: "w1", name: "Acme", slug: "acme", role: "workspace_owner" },
          { id: "w2", name: "Beta", slug: "beta", role: "viewer" },
        ],
      },
    });
    vi.mocked(workspaceApi.switchWorkspace).mockResolvedValue({
      data: { id: "w2", name: "Beta", slug: "beta", role: "viewer" },
    });

    const interactions = userEvent.setup();
    renderSwitcher();

    const select = await screen.findByRole("combobox");
    await interactions.selectOptions(select, "w2");

    expect(workspaceApi.switchWorkspace).toHaveBeenCalledWith("w2");
  });
});
