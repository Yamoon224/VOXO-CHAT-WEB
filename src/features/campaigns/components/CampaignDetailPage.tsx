"use client";

import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useCampaignDetailPage } from "@/features/campaigns/components/useCampaignDetailPage";
import type { CampaignSendStatus } from "@/features/campaigns/types";

const SEND_STATUS_TONE: Record<CampaignSendStatus, "neutral" | "primary" | "danger"> = {
  pending: "neutral",
  sent: "primary",
  failed: "danger",
  skipped: "neutral",
};

/** Écran `/settings/campaigns/[id]` : détail d'une campagne, statistiques et envois par contact (section 2.9). */
export function CampaignDetailPage({ campaignId }: { campaignId: string }) {
  const { loadState, campaign, sends, actionError, send } = useCampaignDetailPage(campaignId);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement…
      </div>
    );
  }

  if (loadState.status === "error" || campaign === null) {
    return <Alert variant="error">{loadState.status === "error" ? loadState.error.message : "Campagne introuvable."}</Alert>;
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">{campaign.name}</p>
            <p className="text-sm text-muted">{campaign.channel_label}</p>
          </div>
          {campaign.status === "draft" ? (
            <Button type="button" onClick={() => void send()}>
              Envoyer
            </Button>
          ) : (
            <p className="text-sm text-muted">Envoyée le {formatDate(campaign.sent_at)}</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted">En attente</p>
            <p className="text-lg font-semibold text-foreground">{campaign.stats.pending}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Envoyés</p>
            <p className="text-lg font-semibold text-foreground">{campaign.stats.sent}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Échoués</p>
            <p className="text-lg font-semibold text-foreground">{campaign.stats.failed}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Ignorés</p>
            <p className="text-lg font-semibold text-foreground">{campaign.stats.skipped}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Envois</h2>
        {sends.length === 0 ? (
          <EmptyState title="Aucun envoi" description="Les envois apparaîtront ici une fois la campagne lancée." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {sends.map((row) => (
              <li key={row.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="text-foreground">{row.contact_name ?? row.contact_email ?? "Contact supprimé"}</p>
                  {row.error && <p className="text-xs text-muted">{row.error}</p>}
                </div>
                <Badge tone={SEND_STATUS_TONE[row.status]}>{row.status_label}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
