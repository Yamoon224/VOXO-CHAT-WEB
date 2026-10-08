import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InviteMemberForm } from "@/features/team/components/InviteMemberForm";
import { ApiError } from "@/lib/api/errors";

describe("InviteMemberForm", () => {
  it("invite une adresse puis vide le formulaire", async () => {
    const invite = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<InviteMemberForm invite={invite} />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "nouveau@example.test");
    await user.selectOptions(screen.getByLabelText("Rôle"), "viewer");
    await user.click(screen.getByRole("button", { name: "Inviter" }));

    expect(invite).toHaveBeenCalledWith("nouveau@example.test", "viewer");
    expect(await screen.findByLabelText("Adresse e-mail")).toHaveValue("");
  });

  it("affiche l'erreur quand l'adresse est déjà membre", async () => {
    const invite = vi.fn().mockRejectedValue(
      new ApiError(409, "Cette personne fait déjà partie de l'espace de travail.", "already_member"),
    );
    const user = userEvent.setup();

    render(<InviteMemberForm invite={invite} />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "deja@example.test");
    await user.click(screen.getByRole("button", { name: "Inviter" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("déjà partie");
  });
});
