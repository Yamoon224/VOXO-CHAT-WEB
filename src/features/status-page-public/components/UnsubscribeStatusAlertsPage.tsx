"use client";

import { useEffect, useState } from "react";
import { Alert, Spinner } from "@/components/ui";
import * as statusPagePublicApi from "@/features/status-page-public/api";
import { ApiError } from "@/lib/api/errors";

type State = { status: "submitting" } | { status: "done" } | { status: "error"; error: ApiError };

/**
 * Écran `/status/unsubscribe` : soumet le jeton en `POST` au chargement de
 * la page, jamais en `GET` sur le lien lui-même — un pré-chargeur de lien
 * (antivirus, aperçu de messagerie) qui suit un lien `GET` déclencherait la
 * désinscription sans que personne ne l'ait demandé.
 */
export function UnsubscribeStatusAlertsPage({ token }: { token: string }) {
  const [state, setState] = useState<State>({ status: "submitting" });

  useEffect(() => {
    if (!token) {
      setState({ status: "error", error: new ApiError(422, "Lien de désinscription invalide.", "invalid_token") });
      return;
    }

    statusPagePublicApi
      .unsubscribe(token)
      .then(() => setState({ status: "done" }))
      .catch((caught: unknown) => setState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() }));
  }, [token]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10">
      <h1 className="text-xl font-semibold text-foreground">Désinscription</h1>

      {state.status === "submitting" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Traitement…
        </div>
      )}

      {state.status === "done" && <Alert variant="success">Vous ne recevrez plus d&apos;alertes de cette page de statut.</Alert>}
      {state.status === "error" && <Alert variant="error">{state.error.message}</Alert>}
    </div>
  );
}
