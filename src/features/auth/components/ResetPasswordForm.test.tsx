import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));
vi.mock("@/features/auth/api");

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("réinitialise le mot de passe puis redirige vers la connexion", async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<ResetPasswordForm email="awa@example.test" token="jeton-valide" />);

    await user.type(screen.getByLabelText("Nouveau mot de passe"), "nouveau-mot-de-passe");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "nouveau-mot-de-passe");
    await user.click(screen.getByRole("button", { name: "Réinitialiser le mot de passe" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
    expect(authApi.resetPassword).toHaveBeenCalledWith({
      email: "awa@example.test",
      token: "jeton-valide",
      password: "nouveau-mot-de-passe",
      password_confirmation: "nouveau-mot-de-passe",
    });
  });

  it("affiche l'erreur d'un jeton invalide", async () => {
    vi.mocked(authApi.resetPassword).mockRejectedValue(
      new ApiError(422, "Ce lien de réinitialisation est invalide ou a expiré.", "invalid_reset_token"),
    );

    const user = userEvent.setup();
    render(<ResetPasswordForm email="awa@example.test" token="jeton-expire" />);

    await user.type(screen.getByLabelText("Nouveau mot de passe"), "nouveau-mot-de-passe");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "nouveau-mot-de-passe");
    await user.click(screen.getByRole("button", { name: "Réinitialiser le mot de passe" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("invalide ou a expiré");
  });

  it("refuse un lien incomplet sans appeler l'API", () => {
    render(<ResetPasswordForm email="" token="" />);

    expect(screen.getByRole("alert")).toHaveTextContent("incomplet");
    expect(screen.queryByLabelText("Nouveau mot de passe")).not.toBeInTheDocument();
  });
});
