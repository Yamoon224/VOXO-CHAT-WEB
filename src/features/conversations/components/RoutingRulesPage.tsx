"use client";

import { useState } from "react";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useRoutingRulesPage } from "@/features/conversations/components/useRoutingRulesPage";
import { RoutingRuleForm } from "@/features/conversations/components/RoutingRuleForm";

/** Écran `/settings/routing-rules` : règles de routage de la boîte de réception (lot 5, section 2.4). */
export function RoutingRulesPage() {
  const { loadState, rules, members, actionError, create, update, remove } = useRoutingRulesPage();
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

  const editing = rules.find((rule) => rule.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier la règle" : "Ajouter une règle"}</h2>
        <RoutingRuleForm
          key={editing?.id ?? "new"}
          initial={editing}
          members={members}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Règles de routage</h2>
        {rules.length === 0 ? (
          <EmptyState
            title="Aucune règle"
            description="Sans règle, une nouvelle conversation reste non affectée jusqu'à ce qu'un agent la prenne."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {rules.map((rule) => (
              <li key={rule.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {rule.name} {!rule.is_active && <span className="text-muted">(inactive)</span>}
                  </p>
                  <p className="text-sm text-muted">{rule.action_type_label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" type="button" onClick={() => setEditingId(rule.id)}>
                    Modifier
                  </Button>
                  <Button variant="danger" type="button" onClick={() => remove(rule.id)}>
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
