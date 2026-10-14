"use client";

import { useState } from "react";
import { Alert, Button, EmptyState, Spinner } from "@/components/ui";
import { useHelpCenterCategories } from "@/features/help-center/components/useHelpCenterCategories";
import { HelpCenterCategoryForm } from "@/features/help-center/components/HelpCenterCategoryForm";

export function HelpCenterCategoriesSection() {
  const { loadState, categories, actionError, create, update, remove } = useHelpCenterCategories();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des catégories…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  const editing = categories.find((category) => category.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <HelpCenterCategoryForm
        key={editing?.id ?? "new"}
        initial={editing}
        onSubmit={(name) =>
          editing ? update(editing.id, name, editing.position).then(() => setEditingId(null)) : create(name)
        }
        onCancel={() => setEditingId(null)}
      />

      {categories.length === 0 ? (
        <EmptyState title="Aucune catégorie" description="Regroupez vos articles par thème." />
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{category.name}</p>
                <p className="text-xs text-muted">/{category.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" type="button" onClick={() => setEditingId(category.id)}>
                  Modifier
                </Button>
                <Button variant="danger" type="button" onClick={() => remove(category.id)}>
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
