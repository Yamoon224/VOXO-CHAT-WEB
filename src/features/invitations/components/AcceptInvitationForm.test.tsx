import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AcceptInvitationForm } from "@/features/invitations/components/AcceptInvitationForm";
import { SessionProvider } from "@/lib/auth/session-context";
import * as invitationsApi from "@/features/invitations/api";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));
vi.mock("@/features/invitations/api");
vi.mock("@/features/auth/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const preview = {
  email: "nouveau@example.test",
  workspace_name: "Acme",
  role: "agent" as const,
  role_label: "Agent",
  invited_by: "Awa",
  expires_at: "2026-10-14T00:00:00Z",
  account_exists: false,
};

function renderForm(token = "jeton-valide") {
  return render(
    <SessionProvider>
      <AcceptInvitationForm token={token} />
    </SessionProvider>,
  );
}

describe("AcceptInvitationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authApi.me).mockRejectedValue(new ApiError(401, "Non authentifié.", "unauthenticated"));
  });

  it("affiche les détails de l'invitation puis crée le compte à l'acceptation", async () => {
    vi.mocked(invitationsApi.previewInvitation).mockResolvedValue({ data: preview });
    vi.mocked(invitationsApi.acceptInvitation).mockResolvedValue({
      data: { token: "token-nouveau", workspace_id: "w1" },
    });

    const user = userEvent.setup();
    renderForm();

    expect(await screen.findByText(/Acme/)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Nom"), "Nouvelle Recrue");
    await user.type(screen.getByLabelText("Choisissez un mot de passe"), "motdepasse-solide");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "motdepasse-solide");
    await user.click(screen.getByRole("button", { name: "Accepter l'invitation" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("invite à se connecter quand un compte existe déjà", async () => {
    vi.mocked(invitationsApi.previewInvitation).mockResolvedValue({
      data: { ...preview, account_exists: true },
    });
    vi.mocked(invitationsApi.acceptInvitation).mockRejectedValue(
      new ApiError(409, "Un compte existe déjà pour cette adresse.", "login_required"),
    );

    const user = userEvent.setup();
    renderForm();

    await screen.findByText(/Acme/);
    await user.click(screen.getByRole("button", { name: "Accepter l'invitation" }));

    expect(await screen.findByText(/connectez-vous/i)).toBeInTheDocument();
  });

  it("affiche une erreur pour un jeton inconnu", async () => {
    vi.mocked(invitationsApi.previewInvitation).mockRejectedValue(
      new ApiError(404, "Cette invitation est introuvable.", "invitation_invalid"),
    );

    renderForm("jeton-invente");

    expect(await screen.findByText("Cette invitation est introuvable.")).toBeInTheDocument();
  });
});
