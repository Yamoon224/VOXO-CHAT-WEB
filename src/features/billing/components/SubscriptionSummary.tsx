"use client";

import { Badge, Button } from "@/components/ui";
import { formatDate, formatMoney } from "@/lib/format";
import { SUBSCRIPTION_STATUS_TONE } from "@/features/billing/status";
import type { Subscription } from "@/features/billing/types";

export function SubscriptionSummary({
  subscription,
  canManage,
  onCancel,
}: {
  subscription: Subscription;
  canManage: boolean;
  onCancel: () => void;
}) {
  const canCancel = canManage && subscription.plan.slug !== "free" && subscription.status !== "canceled";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">{subscription.plan.name}</h3>
        <Badge tone={SUBSCRIPTION_STATUS_TONE[subscription.status]}>{subscription.status_label}</Badge>
      </div>

      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Tarif</dt>
          <dd className="text-foreground">
            {formatMoney(subscription.plan.price_cents, subscription.plan.currency)}
            {subscription.plan.price_cents !== null && (subscription.plan.billing_interval === "month" ? " / mois" : " / an")}
          </dd>
        </div>

        <div>
          <dt className="text-muted">Solde de crédits IA</dt>
          <dd className="text-foreground">{subscription.ai_credit_balance}</dd>
        </div>

        {subscription.trial_ends_at && (
          <div>
            <dt className="text-muted">Fin de l&apos;essai</dt>
            <dd className="text-foreground">{formatDate(subscription.trial_ends_at)}</dd>
          </div>
        )}

        {subscription.current_period_end && (
          <div>
            <dt className="text-muted">Fin de la période en cours</dt>
            <dd className="text-foreground">{formatDate(subscription.current_period_end)}</dd>
          </div>
        )}
      </dl>

      {canCancel && (
        <div>
          <Button variant="danger" type="button" onClick={onCancel}>
            Résilier l&apos;abonnement
          </Button>
        </div>
      )}
    </div>
  );
}
