import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactsPage } from "@/features/contacts/components/ContactsPage";
import * as contactsApi from "@/features/contacts/api";
import type { Contact } from "@/features/contacts/types";

vi.mock("@/features/contacts/api");

const awa: Contact = {
  id: "contact-1",
  name: "Awa Koné",
  email: "awa@example.test",
  phone: null,
  custom_attributes: {},
  created_at: "2026-10-01T00:00:00Z",
};

describe("ContactsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les contacts et en cree un nouveau", async () => {
    vi.mocked(contactsApi.listContacts).mockResolvedValue({
      data: [awa],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
    vi.mocked(contactsApi.createContact).mockResolvedValue({
      data: { id: "contact-2", name: "Koffi Nouveau", email: null, phone: null, custom_attributes: {}, created_at: null },
    });
    const user = userEvent.setup();

    render(<ContactsPage />);

    expect(await screen.findByText("Awa Koné")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Nom"), "Koffi Nouveau");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() => expect(screen.getByText("Koffi Nouveau")).toBeInTheDocument());
  });

  it("supprime un contact", async () => {
    vi.mocked(contactsApi.listContacts).mockResolvedValue({
      data: [awa],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
    });
    vi.mocked(contactsApi.deleteContact).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ContactsPage />);
    await screen.findByText("Awa Koné");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Awa Koné")).not.toBeInTheDocument());
  });

  it("affiche un etat vide sans contact", async () => {
    vi.mocked(contactsApi.listContacts).mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 },
    });

    render(<ContactsPage />);

    expect(await screen.findByText("Aucun contact")).toBeInTheDocument();
  });
});
