import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { SessionProvider } from "@/lib/auth/session-context";
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

function renderForm() {
  return render(
    <SessionProvider>
      <RegisterForm />
    </SessionProvider>,
  );
}

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée le compte et redirige vers le tableau de bord", async () => {
    vi.mocked(authApi.register).mockResolvedValue({
      data: {
        token: "token-123",
        session: {
          user: {
            id: "u1",
            name: "Awa",
            email: "awa@example.test",
            locale: "fr",
            email_verified: false,
            two_factor_enabled: false,
            is_platform_admin: false,
            last_login_at: null,
          },
          workspace: { id: "w1", name: "Acme", slug: "acme", role: "workspace_owner" },
          permissions: [],
          workspaces: [],
        },
      },
    });

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Nom"), "Awa");
    await user.type(screen.getByLabelText("Adresse e-mail"), "awa@example.test");
    await user.type(screen.getByLabelText("Mot de passe"), "motdepasse-solide");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "motdepasse-solide");
    await user.type(screen.getByLabelText("Nom de votre espace de travail"), "Acme");
    await user.click(screen.getByRole("button", { name: "Créer mon compte" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("affiche les erreurs de validation par champ", async () => {
    vi.mocked(authApi.register).mockRejectedValue(
      new ApiError(422, "Les données fournies sont invalides.", "validation_failed", {}, {
        email: ["Cette adresse e-mail est déjà utilisée."],
      }),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Nom"), "Awa");
    await user.type(screen.getByLabelText("Adresse e-mail"), "awa@example.test");
    await user.type(screen.getByLabelText("Mot de passe"), "motdepasse-solide");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "motdepasse-solide");
    await user.type(screen.getByLabelText("Nom de votre espace de travail"), "Acme");
    await user.click(screen.getByRole("button", { name: "Créer mon compte" }));

    expect(await screen.findByText("Cette adresse e-mail est déjà utilisée.")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
