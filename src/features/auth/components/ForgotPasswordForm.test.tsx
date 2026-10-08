import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

vi.mock("@/features/auth/api");

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche un message de confirmation neutre après l'envoi", async () => {
    vi.mocked(authApi.requestPasswordReset).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "awa@example.test");
    await user.click(screen.getByRole("button", { name: "Envoyer le lien de réinitialisation" }));

    expect(await screen.findByText(/un lien de réinitialisation/i)).toBeInTheDocument();
  });

  it("affiche une erreur réseau sans bloquer l'utilisateur", async () => {
    vi.mocked(authApi.requestPasswordReset).mockRejectedValue(ApiError.networkError());

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "awa@example.test");
    await user.click(screen.getByRole("button", { name: "Envoyer le lien de réinitialisation" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de joindre le serveur");
  });
});
