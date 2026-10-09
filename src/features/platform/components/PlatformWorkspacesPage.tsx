"use client";

import { Alert, Badge, Button, EmptyState, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useRequirePlatformAdmin } from "@/lib/auth/use-require-platform-admin";
import { SUBSCRIPTION_STATUS_TONE } from "@/features/billing/status";
import { usePlatformWorkspacesPage } from "@/features/platform/components/usePlatformWorkspacesPage";

const STATUS_LABELS: Record<string, string> = {
  trialing: "À l'essai",
  active: "Actif",
  past_due: "Paiement en retard",
  canceled: "Résilié",
};

/** Écran `/platform/workspaces` : tous les espaces de travail, réservé à `platform_admin`. */
export function PlatformWorkspacesPage() {
  const { isAuthorized } = useRequirePlatformAdmin();
  const { loadState, workspaces, meta, goToPage } = usePlatformWorkspacesPage(isAuthorized);

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
        Chargement des espaces de travail…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  if (workspaces.length === 0) {
    return <EmptyState title="Aucun espace de travail" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-border/30 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-2">Espace</th>
              <th className="px-4 py-2">Membres</th>
              <th className="px-4 py-2">Palier</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Créé le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {workspaces.map((workspace) => (
              <tr key={workspace.id}>
                <td className="px-4 py-2">
                  <p className="font-medium text-foreground">{workspace.name}</p>
                  <p className="text-muted">{workspace.slug}</p>
                </td>
                <td className="px-4 py-2 text-foreground">{workspace.member_count}</td>
                <td className="px-4 py-2 text-foreground">{workspace.plan_name ?? "—"}</td>
                <td className="px-4 py-2">
                  {workspace.subscription_status && (
                    <Badge tone={SUBSCRIPTION_STATUS_TONE[workspace.subscription_status]}>
                      {STATUS_LABELS[workspace.subscription_status]}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-2 text-foreground">{formatDate(workspace.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between text-sm text-muted">
          <Button
            type="button"
            variant="secondary"
            disabled={meta.current_page <= 1}
            onClick={() => goToPage(meta.current_page - 1)}
          >
            Précédent
          </Button>
          <span>
            Page {meta.current_page} sur {meta.last_page}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={meta.current_page >= meta.last_page}
            onClick={() => goToPage(meta.current_page + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
