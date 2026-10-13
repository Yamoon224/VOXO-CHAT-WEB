"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import { useRequirePlatformAdmin } from "@/lib/auth/use-require-platform-admin";
import { usePlatformPlansPage } from "@/features/platform/components/usePlatformPlansPage";
import { PlanForm } from "@/features/platform/components/PlanForm";

/** Écran `/platform/plans` : CRUD du catalogue de plans, réservé à `platform_admin`. */
export function PlatformPlansPage() {
  const { isAuthorized } = useRequirePlatformAdmin();
  const { loadState, plans, actionError, create, update, remove } = usePlatformPlansPage(isAuthorized);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isAuthorized) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
      </div>
    );
  }

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des paliers…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  const editing = plans.find((plan) => plan.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier le palier" : "Créer un palier"}</h2>
        <PlanForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(input) => (editing ? update(editing.id, input).then(() => setEditingId(null)) : create(input))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Catalogue de plans</h2>
        {plans.length === 0 ? (
          <EmptyState title="Aucun palier" description="Créez le premier palier de la grille tarifaire." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-border/30 text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-2">Palier</th>
                  <th className="px-4 py-2">Prix</th>
                  <th className="px-4 py-2">Statut</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-4 py-2">
                      <p className="font-medium text-foreground">{plan.name}</p>
                      <p className="text-muted">{plan.slug}</p>
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      {formatMoney(plan.price_cents, plan.currency)}
                      {plan.is_custom && <span className="text-muted"> (sur devis)</span>}
                    </td>
                    <td className="px-4 py-2">
                      <Badge tone={plan.is_active ? "primary" : "neutral"}>{plan.is_active ? "Actif" : "Inactif"}</Badge>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" type="button" onClick={() => setEditingId(plan.id)}>
                          Modifier
                        </Button>
                        <Button variant="danger" type="button" onClick={() => remove(plan.id)}>
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
