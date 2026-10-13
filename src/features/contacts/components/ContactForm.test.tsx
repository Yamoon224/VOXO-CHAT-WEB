import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/features/contacts/components/ContactForm";

describe("ContactForm", () => {
  it("cree un contact puis vide le formulaire", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nom"), "Awa Koné");
    await user.type(screen.getByLabelText("E-mail"), "awa@example.test");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Awa Koné",
      email: "awa@example.test",
      phone: null,
      custom_attributes: null,
    });
    expect(await screen.findByLabelText("Nom")).toHaveValue("");
  });
});
