"use client";

import { useState } from "react";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useAutomationScenariosPage } from "@/features/automations/components/useAutomationScenariosPage";
import { AutomationScenarioForm } from "@/features/automations/components/AutomationScenarioForm";
import { AutomationScenarioTester } from "@/features/automations/components/AutomationScenarioTester";

/** Écran `/settings/automations` : scénarios d'automatisation de l'espace courant (lot 5, section 2.8). */
export function AutomationScenariosPage() {
  const { loadState, scenarios, members, actionError, create, update, remove } = useAutomationScenariosPage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

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

  const editing = scenarios.find((scenario) => scenario.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier le scénario" : "Ajouter un scénario"}</h2>
        <AutomationScenarioForm
          key={editing?.id ?? "new"}
          initial={editing}
          members={members}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Scénarios</h2>
        {scenarios.length === 0 ? (
          <EmptyState title="Aucun scénario" description="Un scénario reste en brouillon jusqu'à ce que vous le publiiez." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {scenarios.map((scenario) => (
              <li key={scenario.id} className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {scenario.name} <span className="text-muted">— {scenario.status_label}</span>
                    </p>
                    <p className="text-sm text-muted">{scenario.trigger_type_label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" type="button" onClick={() => setTestingId(testingId === scenario.id ? null : scenario.id)}>
                      {testingId === scenario.id ? "Fermer le test" : "Tester"}
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => setEditingId(scenario.id)}>
                      Modifier
                    </Button>
                    <Button variant="danger" type="button" onClick={() => remove(scenario.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>

                {testingId === scenario.id && <AutomationScenarioTester scenarioId={scenario.id} />}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
