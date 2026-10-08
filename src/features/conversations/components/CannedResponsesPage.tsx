"use client";

import { useState } from "react";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useCannedResponsesPage } from "@/features/conversations/components/useCannedResponsesPage";
import { CannedResponseForm } from "@/features/conversations/components/CannedResponseForm";

/** Écran `/settings/canned-responses` : réponses pré-enregistrées de l'espace courant. */
export function CannedResponsesPage() {
  const { loadState, responses, actionError, create, update, remove } = useCannedResponsesPage();
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

  const editing = responses.find((response) => response.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          {editing ? "Modifier la réponse" : "Ajouter une réponse"}
        </h2>
        <CannedResponseForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(title, body) =>
            editing ? update(editing.id, title, body).then(() => setEditingId(null)) : create(title, body)
          }
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Réponses pré-enregistrées</h2>
        {responses.length === 0 ? (
          <EmptyState title="Aucune réponse" description="Ajoutez un texte réutilisable pour répondre plus vite." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {responses.map((response) => (
              <li key={response.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{response.title}</p>
                  <p className="text-sm text-muted">{response.body}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" type="button" onClick={() => setEditingId(response.id)}>
                    Modifier
                  </Button>
                  <Button variant="danger" type="button" onClick={() => remove(response.id)}>
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
