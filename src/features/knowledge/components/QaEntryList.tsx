"use client";

import { Badge, Button } from "@/components/ui";
import type { KnowledgeQaEntry } from "@/features/knowledge/types";

export function QaEntryList({
  entries,
  canManage,
  editingEntryId,
  onEdit,
  onCancelEdit,
  onDelete,
}: {
  entries: KnowledgeQaEntry[];
  canManage: boolean;
  editingEntryId: string | null;
  onEdit: (entryId: string) => void;
  onCancelEdit: () => void;
  onDelete: (entryId: string) => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {entries.map((entry) => (
        <li key={entry.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{entry.question}</p>
            <p className="text-sm text-muted">{entry.answer}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone={entry.status === "failed" ? "danger" : "primary"}>{entry.status_label}</Badge>
            {canManage && (
              <>
                {editingEntryId === entry.id ? (
                  <Button variant="secondary" type="button" onClick={onCancelEdit}>
                    Annuler
                  </Button>
                ) : (
                  <Button variant="secondary" type="button" onClick={() => onEdit(entry.id)}>
                    Modifier
                  </Button>
                )}
                <Button variant="danger" type="button" onClick={() => onDelete(entry.id)}>
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
