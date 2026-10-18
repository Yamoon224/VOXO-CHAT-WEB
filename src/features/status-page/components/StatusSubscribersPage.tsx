"use client";

import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useStatusSubscribersPage } from "@/features/status-page/components/useStatusSubscribersPage";

/** Section « Abonnés » de `/settings/status-page` (lot 7, section 2.11) : l'inscription se fait uniquement depuis la page publique. */
export function StatusSubscribersPage() {
  const { loadState, subscribers, actionError, remove } = useStatusSubscribersPage();

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

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Abonnés aux alertes</h2>
        {subscribers.length === 0 ? (
          <EmptyState title="Aucun abonné" description="Les visiteurs s'inscrivent depuis la page de statut publique." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {subscribers.map((subscriber) => (
              <li key={subscriber.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-foreground">{subscriber.email}</span>
                <Button variant="danger" type="button" onClick={() => remove(subscriber.id)}>
                  Retirer
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
