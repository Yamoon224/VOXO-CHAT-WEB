import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactProfileForm } from "@/features/contacts/components/ContactProfileForm";
import type { Contact } from "@/features/contacts/types";

const contact: Contact = {
  id: "contact-1",
  name: "Awa Koné",
  email: "awa@example.test",
  phone: null,
  custom_attributes: {},
  created_at: "2026-10-01T00:00:00Z",
};

describe("ContactProfileForm", () => {
  it("pre-remplit depuis le contact et enregistre les modifications", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ContactProfileForm contact={contact} update={update} />);

    expect(screen.getByLabelText("Nom")).toHaveValue("Awa Koné");

    await user.clear(screen.getByLabelText("Téléphone"));
    await user.type(screen.getByLabelText("Téléphone"), "0600000000");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(update).toHaveBeenCalledWith({ name: "Awa Koné", email: "awa@example.test", phone: "0600000000" });
  });
});
