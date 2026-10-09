import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlatformWorkspacesPage } from "@/features/platform/components/PlatformWorkspacesPage";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import * as platformApi from "@/features/platform/api";
import type { PlatformWorkspace } from "@/features/platform/types";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));
vi.mock("@/features/auth/api");
vi.mock("@/features/platform/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const acme: PlatformWorkspace = {
  id: "w1",
  name: "Acme",
  slug: "acme",
  created_at: "2026-09-01T00:00:00Z",
  member_count: 3,
  plan_slug: "business",
  plan_name: "Business",
  subscription_status: "active",
  current_period_end: "2026-11-01T00:00:00Z",
};

function mockSessionAs(isPlatformAdmin: boolean) {
  vi.mocked(authApi.me).mockResolvedValue({
    data: {
      user: {
        id: "user-self",
        name: "Moi",
        email: "moi@example.test",
        locale: "fr",
        email_verified: true,
        two_factor_enabled: false,
        is_platform_admin: isPlatformAdmin,
        last_login_at: null,
      },
      workspace: null,
      permissions: [],
      workspaces: [],
    },
  });
}

function renderPage() {
  return render(
    <SessionProvider>
      <PlatformWorkspacesPage />
    </SessionProvider>,
  );
}

describe("PlatformWorkspacesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les espaces de travail pour un administrateur de plateforme", async () => {
    mockSessionAs(true);
    vi.mocked(platformApi.listWorkspaces).mockResolvedValue({
      data: [acme],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });

    renderPage();

    expect(await screen.findByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renvoie un compte ordinaire sans charger la liste", async () => {
    mockSessionAs(false);

    renderPage();

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/dashboard"));
    expect(platformApi.listWorkspaces).not.toHaveBeenCalled();
  });

  it("affiche un état vide sans espace de travail", async () => {
    mockSessionAs(true);
    vi.mocked(platformApi.listWorkspaces).mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 },
    });

    renderPage();

    expect(await screen.findByText("Aucun espace de travail")).toBeInTheDocument();
  });

  it("la pagination demande la page suivante", async () => {
    mockSessionAs(true);
    vi.mocked(platformApi.listWorkspaces).mockResolvedValue({
      data: [acme],
      meta: { current_page: 1, last_page: 2, per_page: 25, total: 26 },
    });

    const user = userEvent.setup();
    renderPage();

    await screen.findByText("Acme");
    await user.click(screen.getByRole("button", { name: "Suivant" }));

    expect(platformApi.listWorkspaces).toHaveBeenLastCalledWith(2);
  });
});
