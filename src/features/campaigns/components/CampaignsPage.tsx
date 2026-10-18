"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useCampaignsPage } from "@/features/campaigns/components/useCampaignsPage";
import { CampaignForm } from "@/features/campaigns/components/CampaignForm";
import type { CampaignStatus } from "@/features/campaigns/types";

const STATUS_TONE: Record<CampaignStatus, "neutral" | "primary"> = { draft: "neutral", sent: "primary" };

/** Section « Campagnes » de `/settings/campaigns` (lot 6, section 2.9). */
export function CampaignsPage() {
  const { loadState, campaigns, segments, templates, actionError, create, update, remove, send } = useCampaignsPage();
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

  const editing = campaigns.find((campaign) => campaign.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier la campagne" : "Créer une campagne"}</h2>
        <CampaignForm
          key={editing?.id ?? "new"}
          initial={editing}
          segments={segments}
          templates={templates}
          onSubmit={(payload) => (editing ? update(editing.id, payload).then(() => setEditingId(null)) : create(payload))}
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Campagnes</h2>
        {campaigns.length === 0 ? (
          <EmptyState title="Aucune campagne" description="Créez une campagne à partir d'un segment et d'un modèle." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/settings/campaigns/${campaign.id}`} className="text-sm font-medium text-foreground hover:underline">
                    {campaign.name}
                  </Link>
                  <p className="text-sm text-muted">
                    {campaign.channel_label} · <Badge tone={STATUS_TONE[campaign.status]}>{campaign.status_label}</Badge>
                    {campaign.status === "sent" && (
                      <span className="ml-2">
                        {campaign.stats.sent} envoyés, {campaign.stats.failed} échoués, {campaign.stats.skipped} ignorés
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {campaign.status === "draft" && (
                    <>
                      <Button variant="secondary" type="button" onClick={() => setEditingId(campaign.id)}>
                        Modifier
                      </Button>
                      <Button variant="primary" type="button" onClick={() => void send(campaign.id)}>
                        Envoyer
                      </Button>
                    </>
                  )}
                  <Button variant="danger" type="button" onClick={() => remove(campaign.id)}>
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
