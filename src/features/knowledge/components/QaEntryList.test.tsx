import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QaEntryList } from "@/features/knowledge/components/QaEntryList";
import type { KnowledgeQaEntry } from "@/features/knowledge/types";

const entry: KnowledgeQaEntry = {
  id: "qa-1",
  question: "Quels sont vos horaires ?",
  answer: "De 9h à 18h.",
  status: "indexed",
  status_label: "Indexé",
  chunk_count: 1,
  created_at: "2026-10-08T00:00:00Z",
};

describe("QaEntryList", () => {
  it("permet de modifier puis d'annuler l'édition", async () => {
    const onEdit = vi.fn();
    const onCancelEdit = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <QaEntryList
        entries={[entry]}
        canManage
        editingEntryId={null}
        onEdit={onEdit}
        onCancelEdit={onCancelEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Modifier" }));
    expect(onEdit).toHaveBeenCalledWith("qa-1");

    rerender(
      <QaEntryList
        entries={[entry]}
        canManage
        editingEntryId="qa-1"
        onEdit={onEdit}
        onCancelEdit={onCancelEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Annuler" }));
    expect(onCancelEdit).toHaveBeenCalled();
  });

  it("supprime une entree", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <QaEntryList entries={[entry]} canManage editingEntryId={null} onEdit={vi.fn()} onCancelEdit={vi.fn()} onDelete={onDelete} />,
    );

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(onDelete).toHaveBeenCalledWith("qa-1");
  });
});
