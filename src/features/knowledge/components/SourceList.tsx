"use client";

import { Button } from "@/components/ui";
import type { KnowledgeSource } from "@/features/knowledge/types";

const RECRAWL_LABELS: Record<KnowledgeSource["recrawl_frequency"], string> = {
  manual: "Manuelle",
  daily: "Quotidienne",
  weekly: "Hebdomadaire",
};

export function SourceList({
  sources,
  canManage,
  onDelete,
  onRecrawl,
}: {
  sources: KnowledgeSource[];
  canManage: boolean;
  onDelete: (sourceId: string) => void;
  onRecrawl: (sourceId: string) => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {sources.map((source) => (
        <li key={source.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{source.name}</p>
            <p className="text-sm text-muted">
              {source.type_label}
              {source.type === "website" && (
                <>
                  {" — "}
                  {RECRAWL_LABELS[source.recrawl_frequency]}
                  {source.last_crawled_at
                    ? `, explorée pour la dernière fois le ${new Date(source.last_crawled_at).toLocaleString("fr-FR")}`
                    : ", pas encore explorée"}
                </>
              )}
            </p>
          </div>

          {canManage && (
            <div className="flex items-center gap-2">
              {source.type === "website" && (
                <Button variant="secondary" type="button" onClick={() => onRecrawl(source.id)}>
                  Ré-explorer
                </Button>
              )}
              <Button variant="danger" type="button" onClick={() => onDelete(source.id)}>
                Supprimer
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
