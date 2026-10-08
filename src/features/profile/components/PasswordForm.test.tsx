import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordForm } from "@/features/profile/components/PasswordForm";
import * as profileApi from "@/features/profile/api";
import { ApiError } from "@/lib/api/errors";

vi.mock("@/features/profile/api");

describe("PasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("change le mot de passe et vide le formulaire", async () => {
    vi.mocked(profileApi.updatePassword).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<PasswordForm />);

    await user.type(screen.getByLabelText("Mot de passe actuel"), "ancien-mot-de-passe");
    await user.type(screen.getByLabelText("Nouveau mot de passe"), "nouveau-mot-de-passe");
    await user.type(screen.getByLabelText("Confirmer le nouveau mot de passe"), "nouveau-mot-de-passe");
    await user.click(screen.getByRole("button", { name: "Changer le mot de passe" }));

    expect(await screen.findByText("Mot de passe mis à jour.")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe actuel")).toHaveValue("");
  });

  it("affiche l'erreur quand le mot de passe actuel est incorrect", async () => {
    vi.mocked(profileApi.updatePassword).mockRejectedValue(
      new ApiError(422, "Le mot de passe actuel est incorrect.", "current_password_mismatch"),
    );

    const user = userEvent.setup();
    render(<PasswordForm />);

    await user.type(screen.getByLabelText("Mot de passe actuel"), "faux");
    await user.type(screen.getByLabelText("Nouveau mot de passe"), "nouveau-mot-de-passe");
    await user.type(screen.getByLabelText("Confirmer le nouveau mot de passe"), "nouveau-mot-de-passe");
    await user.click(screen.getByRole("button", { name: "Changer le mot de passe" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("incorrect");
  });
});
