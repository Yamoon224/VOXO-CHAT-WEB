"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import type { InboxView } from "@/features/conversations/types";

/** Sous-boîtes (lot 5, section 2.4) : les filtres courants de la boîte de réception, enregistrés sous un nom, en un clic. */
export function InboxViewsBar({
  views,
  activeViewId,
  onApply,
  onClear,
  onSave,
  onRemove,
}: {
  views: InboxView[];
  activeViewId: string | null;
  onApply: (view: InboxView) => void;
  onClear: () => void;
  onSave: (name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");

  async function handleSave() {
    if (name.trim() === "") {
      return;
    }
    await onSave(name.trim());
    setName("");
    setIsCreating(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant={activeViewId === null ? "primary" : "secondary"}
        onClick={onClear}
        className="px-3 py-1 text-xs"
      >
        Toutes les conversations
      </Button>

      {views.map((view) => (
        <span key={view.id} className="inline-flex items-center gap-1">
          <Button
            type="button"
            variant={activeViewId === view.id ? "primary" : "secondary"}
            onClick={() => onApply(view)}
            className="px-3 py-1 text-xs"
          >
            {view.name}
          </Button>
          <button
            type="button"
            onClick={() => onRemove(view.id)}
            aria-label={`Supprimer la vue ${view.name}`}
            className="text-xs text-muted hover:text-foreground"
          >
            ×
          </button>
        </span>
      ))}

      {isCreating ? (
        <span className="inline-flex items-center gap-2">
          <input
            aria-label="Nom de la vue"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nom de la vue"
            className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-xs text-foreground"
          />
          <Button type="button" variant="secondary" onClick={handleSave} className="px-3 py-1 text-xs">
            Enregistrer
          </Button>
          <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} className="px-3 py-1 text-xs">
            Annuler
          </Button>
        </span>
      ) : (
        <Button type="button" variant="ghost" onClick={() => setIsCreating(true)} className="px-3 py-1 text-xs">
          + Enregistrer la vue courante
        </Button>
      )}
    </div>
  );
}
