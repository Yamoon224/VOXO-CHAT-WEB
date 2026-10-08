import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SessionProvider, useSession } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));
vi.mock("@/features/auth/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

function SessionSnapshot() {
  const { session } = useSession();
  return <output data-testid="session-email">{session?.user.email ?? "none"}</output>;
}

function renderForm() {
  return render(
    <SessionProvider>
      <LoginForm />
      <SessionSnapshot />
    </SessionProvider>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("connecte l'utilisateur et met à jour la session", async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      data: {
        token: "token-123",
        session: {
          user: {
            id: "u1",
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
      },
    });

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Adresse e-mail"), "awa@example.test");
    await user.type(screen.getByLabelText("Mot de passe"), "password");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => expect(screen.getByTestId("session-email")).toHaveTextContent("awa@example.test"));
    expect(authApi.login).toHaveBeenCalledWith({ email: "awa@example.test", password: "password", code: undefined });
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("affiche un message d'erreur sur identifiants invalides", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new ApiError(422, "Identifiants invalides.", "invalid_credentials"));

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Adresse e-mail"), "awa@example.test");
    await user.type(screen.getByLabelText("Mot de passe"), "faux");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Identifiants invalides.");
  });

  it("révèle le champ du code quand le compte exige la double authentification", async () => {
    vi.mocked(authApi.login).mockRejectedValue(
      new ApiError(422, "Saisissez le code de votre application d'authentification.", "two_factor_required"),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Adresse e-mail"), "awa@example.test");
    await user.type(screen.getByLabelText("Mot de passe"), "password");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByLabelText("Code de vérification")).toBeInTheDocument();
  });
});
