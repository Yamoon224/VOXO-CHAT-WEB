import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactDetailPage } from "@/features/contacts/components/ContactDetailPage";
import * as contactsApi from "@/features/contacts/api";
import type { Contact, ContactEvent, ContactNote } from "@/features/contacts/types";

vi.mock("@/features/contacts/api");

const contact: Contact = {
  id: "contact-1",
  name: "Awa Koné",
  email: "awa@example.test",
  phone: null,
  custom_attributes: {},
  created_at: "2026-10-01T00:00:00Z",
};

const note: ContactNote = { id: "note-1", body: "Client prioritaire.", author_name: "Claire", created_at: "2026-10-01T00:00:00Z" };
const event: ContactEvent = { id: "event-1", type: "note_added", payload: {}, occurred_at: "2026-10-01T00:00:00Z" };

describe("ContactDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le profil, les notes et l'historique", async () => {
    vi.mocked(contactsApi.getContact).mockResolvedValue({ data: contact });
    vi.mocked(contactsApi.listNotes).mockResolvedValue({ data: [note] });
    vi.mocked(contactsApi.listEvents).mockResolvedValue({ data: [event] });

    render(<ContactDetailPage contactId="contact-1" />);

    expect(await screen.findByDisplayValue("Awa Koné")).toBeInTheDocument();
    expect(screen.getByText("Client prioritaire.")).toBeInTheDocument();
    expect(screen.getByText("Note ajoutée")).toBeInTheDocument();
  });

  it("ajoute une note", async () => {
    vi.mocked(contactsApi.getContact).mockResolvedValue({ data: contact });
    vi.mocked(contactsApi.listNotes).mockResolvedValue({ data: [] });
    vi.mocked(contactsApi.listEvents).mockResolvedValue({ data: [] });
    vi.mocked(contactsApi.createNote).mockResolvedValue({
      data: { id: "note-2", body: "Nouvelle note.", author_name: "Claire", created_at: "2026-10-02T00:00:00Z" },
    });
    const user = userEvent.setup();

    render(<ContactDetailPage contactId="contact-1" />);
    await screen.findByDisplayValue("Awa Koné");

    await user.type(screen.getByLabelText("Ajouter une note"), "Nouvelle note.");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() => expect(screen.getByText("Nouvelle note.")).toBeInTheDocument());
  });
});
