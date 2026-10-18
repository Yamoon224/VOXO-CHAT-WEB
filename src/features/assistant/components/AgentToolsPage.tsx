"use client";

import { useState } from "react";
import { Alert, Button, EmptyState, Spinner } from "@/components/ui";
import { useAgentToolsPage } from "@/features/assistant/components/useAgentToolsPage";
import { AgentToolForm } from "@/features/assistant/components/AgentToolForm";

/** Outils déclarés (API REST) que l'agent IA peut appeler pendant une conversation (lot 7, section 2.2, P3). */
export function AgentToolsPage() {
  const { loadState, tools, actionError, create, update, remove } = useAgentToolsPage();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des outils…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  const editing = tools.find((tool) => tool.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <div>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier l'outil" : "Ajouter un outil"}</h2>
        <AgentToolForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Outils déclarés</h2>
        {tools.length === 0 ? (
          <EmptyState
            title="Aucun outil"
            description="Déclarez un appel d'API REST que l'agent IA pourra invoquer pendant une conversation."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {tools.map((tool) => (
              <li key={tool.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {tool.name} {!tool.enabled && <span className="text-muted">(désactivé)</span>}
                  </p>
                  <p className="text-sm text-muted">{tool.description}</p>
                  <p className="mt-1 break-all text-xs text-muted">
                    {tool.http_method} {tool.url}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" type="button" onClick={() => setEditingId(tool.id)}>
                    Modifier
                  </Button>
                  <Button variant="danger" type="button" onClick={() => remove(tool.id)}>
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
