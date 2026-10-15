import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactSegmentsPage } from "@/features/contacts/components/ContactSegmentsPage";
import * as contactsApi from "@/features/contacts/api";
import type { ContactSegment } from "@/features/contacts/types";

vi.mock("@/features/contacts/api");

const vipSegment: ContactSegment = {
  id: "seg-1",
  name: "Clients VIP",
  criteria: [{ field: "email", operator: "contains", value: "acme.com" }],
};

describe("ContactSegmentsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les segments et en cree un nouveau", async () => {
    vi.mocked(contactsApi.listSegments).mockResolvedValue({ data: [vipSegment] });
    vi.mocked(contactsApi.createSegment).mockResolvedValue({
      data: { id: "seg-2", name: "Sans téléphone", criteria: [{ field: "phone", operator: "is_not_set", value: null }] },
    });
    const user = userEvent.setup();

    render(<ContactSegmentsPage />);

    expect(await screen.findByText("Clients VIP")).toBeInTheDocument();
    expect(screen.getByText("email contient « acme.com »")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Nom du segment"), "Sans téléphone");
    await user.type(screen.getByLabelText("Champ"), "phone");
    await user.selectOptions(screen.getByLabelText("Condition"), "is_not_set");
    await user.click(screen.getByRole("button", { name: "Créer le segment" }));

    await waitFor(() => expect(screen.getByText("Sans téléphone")).toBeInTheDocument());
  });

  it("affiche les contacts d'un segment", async () => {
    vi.mocked(contactsApi.listSegments).mockResolvedValue({ data: [vipSegment] });
    vi.mocked(contactsApi.segmentContacts).mockResolvedValue({
      data: [{ id: "contact-1", name: "Awa Koné", email: "awa@acme.com", phone: null, custom_attributes: {}, created_at: null }],
    });
    const user = userEvent.setup();

    render(<ContactSegmentsPage />);
    await screen.findByText("Clients VIP");

    await user.click(screen.getByRole("button", { name: "Voir les contacts" }));

    expect(await screen.findByText("Awa Koné")).toBeInTheDocument();
  });

  it("supprime un segment", async () => {
    vi.mocked(contactsApi.listSegments).mockResolvedValue({ data: [vipSegment] });
    vi.mocked(contactsApi.deleteSegment).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ContactSegmentsPage />);
    await screen.findByText("Clients VIP");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Clients VIP")).not.toBeInTheDocument());
  });

  it("affiche un etat vide sans segment", async () => {
    vi.mocked(contactsApi.listSegments).mockResolvedValue({ data: [] });

    render(<ContactSegmentsPage />);

    expect(await screen.findByText("Aucun segment")).toBeInTheDocument();
  });
});
