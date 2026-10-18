"use client";

import { useState } from "react";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useCampaignTemplatesPage } from "@/features/campaigns/components/useCampaignTemplatesPage";
import { CampaignTemplateForm } from "@/features/campaigns/components/CampaignTemplateForm";

/** Section « Modèles » de `/settings/campaigns` (lot 6, section 2.9). */
export function CampaignTemplatesPage() {
  const { loadState, templates, actionError, create, update, remove } = useCampaignTemplatesPage();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  const editing = templates.find((template) => template.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier le modèle" : "Ajouter un modèle"}</h2>
        <CampaignTemplateForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Modèles</h2>
        {templates.length === 0 ? (
          <EmptyState title="Aucun modèle" description="Un modèle réutilisable est requis pour créer une campagne." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {templates.map((template) => (
              <li key={template.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{template.name}</p>
                  <p className="text-sm text-muted">{template.channel_label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" type="button" onClick={() => setEditingId(template.id)}>
                    Modifier
                  </Button>
                  <Button variant="danger" type="button" onClick={() => remove(template.id)}>
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
