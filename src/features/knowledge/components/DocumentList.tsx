"use client";

import { Badge, Button } from "@/components/ui";
import type { KnowledgeDocument, KnowledgeDocumentStatus } from "@/features/knowledge/types";

const STATUS_TONE: Record<KnowledgeDocumentStatus, "neutral" | "primary" | "danger"> = {
  pending: "neutral",
  processing: "primary",
  indexed: "primary",
  failed: "danger",
};

const STATUS_FILTER_OPTIONS: { value: KnowledgeDocumentStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "processing", label: "En cours" },
  { value: "indexed", label: "Indexé" },
  { value: "failed", label: "Échec" },
];

export function DocumentList({
  documents,
  canManage,
  statusFilter,
  onFilterChange,
  onRetry,
  onDelete,
}: {
  documents: KnowledgeDocument[];
  canManage: boolean;
  statusFilter: KnowledgeDocumentStatus | "";
  onFilterChange: (status: KnowledgeDocumentStatus | "") => void;
  onRetry: (documentId: string) => void;
  onDelete: (documentId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="document-status-filter" className="text-sm font-medium text-foreground">
          Statut
        </label>
        <select
          id="document-status-filter"
          value={statusFilter}
          onChange={(event) => onFilterChange(event.target.value as KnowledgeDocumentStatus | "")}
          className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ul className="flex flex-col divide-y divide-border">
        {documents.map((document) => (
          <li key={document.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{document.title}</p>
              <p className="text-sm text-muted">
                {document.type_label}
                {document.chunk_count > 0 && ` — ${document.chunk_count} passage(s)`}
              </p>
              {document.status === "failed" && document.status_message && (
                <p className="text-sm text-danger">{document.status_message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge tone={STATUS_TONE[document.status]}>{document.status_label}</Badge>
              {canManage && document.status === "failed" && (
                <Button variant="secondary" type="button" onClick={() => onRetry(document.id)}>
                  Redéclencher
                </Button>
              )}
              {canManage && (
                <Button variant="danger" type="button" onClick={() => onDelete(document.id)}>
                  Supprimer
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
