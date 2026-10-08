import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerifyEmailStatus } from "@/features/auth/components/VerifyEmailStatus";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

vi.mock("@/features/auth/api");

describe("VerifyEmailStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche un état de chargement puis le succès", async () => {
    vi.mocked(authApi.verifyEmail).mockResolvedValue({ data: { email: "awa@example.test", email_verified: true } });

    render(<VerifyEmailStatus token="jeton-valide" />);

    expect(screen.getByText(/vérification de votre adresse/i)).toBeInTheDocument();
    expect(await screen.findByText(/confirmée/i)).toBeInTheDocument();
  });

  it("affiche l'erreur d'un jeton invalide", async () => {
    vi.mocked(authApi.verifyEmail).mockRejectedValue(
      new ApiError(422, "Ce lien de vérification est invalide ou a expiré.", "invalid_verification_token"),
    );

    render(<VerifyEmailStatus token="jeton-expire" />);

    expect(await screen.findByRole("alert")).toHaveTextContent("invalide ou a expiré");
  });

  it("affiche directement une erreur sans jeton, sans appeler l'API", () => {
    render(<VerifyEmailStatus token="" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(authApi.verifyEmail).not.toHaveBeenCalled();
  });
});
