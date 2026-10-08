import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentList } from "@/features/knowledge/components/DocumentList";
import type { KnowledgeDocument } from "@/features/knowledge/types";

const failedDocument: KnowledgeDocument = {
  id: "doc-1",
  source_id: "src-1",
  type: "file",
  type_label: "Fichier importé",
  title: "guide.txt",
  origin_url: null,
  original_filename: "guide.txt",
  mime_type: "text/plain",
  status: "failed",
  status_label: "Échec",
  status_message: "Fournisseur indisponible.",
  chunk_count: 0,
  indexed_at: null,
  created_at: "2026-10-08T00:00:00Z",
};

describe("DocumentList", () => {
  it("affiche le message d'échec et permet de redéclencher ou supprimer", async () => {
    const onRetry = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <DocumentList
        documents={[failedDocument]}
        canManage
        statusFilter=""
        onFilterChange={vi.fn()}
        onRetry={onRetry}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Fournisseur indisponible.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Redéclencher" }));
    expect(onRetry).toHaveBeenCalledWith("doc-1");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(onDelete).toHaveBeenCalledWith("doc-1");
  });

  it("change le filtre de statut", async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DocumentList
        documents={[]}
        canManage={false}
        statusFilter=""
        onFilterChange={onFilterChange}
        onRetry={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Statut"), "failed");
    expect(onFilterChange).toHaveBeenCalledWith("failed");
  });
});
