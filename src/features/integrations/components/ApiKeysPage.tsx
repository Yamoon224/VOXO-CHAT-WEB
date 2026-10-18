"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Card, EmptyState, Field, Spinner } from "@/components/ui";
import { useApiKeysPage } from "@/features/integrations/components/useApiKeysPage";
import { ApiError } from "@/lib/api/errors";

/** Section « Clés d'API » de `/settings/integrations` (lot 6, section 2.14). */
export function ApiKeysPage() {
  const { loadState, apiKeys, actionError, issuedToken, dismissIssuedToken, issue, revoke } = useApiKeysPage();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<ApiError | null>(null);

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await issue(name);
      setName("");
    } catch (caught) {
      setFormError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      {issuedToken && (
        <Alert variant="success">
          <p className="mb-2 font-medium">Clé émise — à copier maintenant, elle ne sera plus jamais affichée :</p>
          <code className="block break-all rounded bg-background px-2 py-1 text-xs">{issuedToken}</code>
          <Button variant="ghost" type="button" className="mt-2" onClick={dismissIssuedToken}>
            J&apos;ai copié la clé
          </Button>
        </Alert>
      )}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Émettre une clé d&apos;API</h2>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {formError && <Alert variant="error">{formError.message}</Alert>}
          <Field label="Nom de la clé" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Zapier, script interne…" />
          <div>
            <Button type="submit" isLoading={isSubmitting}>
              Émettre la clé
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Clés d&apos;API</h2>
        {apiKeys.length === 0 ? (
          <EmptyState title="Aucune clé" description="Agit avec les mêmes permissions que la personne qui l'émet, dans cet espace." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {apiKeys.map((apiKey) => (
              <li key={apiKey.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
                  <p className="text-sm text-muted">
                    Émise par {apiKey.created_by_name}
                    {apiKey.last_used_at ? ` · dernière utilisation ${new Date(apiKey.last_used_at).toLocaleDateString("fr-FR")}` : " · jamais utilisée"}
                  </p>
                </div>
                <Button variant="danger" type="button" onClick={() => revoke(apiKey.id)}>
                  Révoquer
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
