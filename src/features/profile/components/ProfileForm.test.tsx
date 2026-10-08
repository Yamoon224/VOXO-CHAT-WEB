import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { SessionProvider } from "@/lib/auth/session-context";
import * as profileApi from "@/features/profile/api";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

vi.mock("@/features/profile/api");
vi.mock("@/features/auth/api");
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

function renderForm() {
  return render(
    <SessionProvider>
      <ProfileForm />
    </SessionProvider>,
  );
}

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authApi.me).mockResolvedValue({
      data: { user, workspace: null, permissions: [], workspaces: [] },
    });
  });

  it("enregistre le profil et affiche une confirmation", async () => {
    vi.mocked(profileApi.updateProfile).mockResolvedValue({ data: { ...user, name: "Awa Koné" } });

    const interactions = userEvent.setup();
    renderForm();

    const nameField = await screen.findByLabelText("Nom");
    await interactions.clear(nameField);
    await interactions.type(nameField, "Awa Koné");
    await interactions.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(await screen.findByText("Profil mis à jour.")).toBeInTheDocument();
    expect(profileApi.updateProfile).toHaveBeenCalledWith({ name: "Awa Koné", locale: "fr" });
  });

  it("affiche l'erreur serveur sans confirmation", async () => {
    vi.mocked(profileApi.updateProfile).mockRejectedValue(ApiError.networkError());

    const interactions = userEvent.setup();
    renderForm();

    await screen.findByLabelText("Nom");
    await interactions.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de joindre le serveur");
    expect(screen.queryByText("Profil mis à jour.")).not.toBeInTheDocument();
  });
});
