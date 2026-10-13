import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MarketingHomeGuard } from "@/features/marketing/components/MarketingHomeGuard";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import { getToken } from "@/lib/auth/token-store";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));
vi.mock("@/features/auth/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

function renderGuard() {
  return render(
    <SessionProvider>
      <MarketingHomeGuard />
    </SessionProvider>,
  );
}

describe("MarketingHomeGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche la page d'accueil du site vitrine sans session", async () => {
    renderGuard();

    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirige vers le tableau de bord quand une session existe", async () => {
    vi.mocked(authApi.me).mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          name: "Awa",
          email: "awa@example.test",
          locale: "fr",
          email_verified: true,
          two_factor_enabled: false,
          is_platform_admin: false,
          last_login_at: null,
        },
        workspace: null,
        permissions: [],
        workspaces: [],
      },
    });
    vi.mocked(getToken).mockReturnValue("token-123");

    renderGuard();

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/dashboard"));
  });
});
