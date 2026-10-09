"use client";

import { Badge, Button } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import type { Plan } from "@/features/billing/types";

export function PlanGrid({
  plans,
  currentPlanSlug,
  pendingPlanSlug,
  onSelect,
}: {
  plans: Plan[];
  currentPlanSlug: string;
  pendingPlanSlug: string | null;
  onSelect: (planSlug: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => {
        const isCurrent = plan.slug === currentPlanSlug;
        const isPending = plan.slug === pendingPlanSlug;

        return (
          <div key={plan.id} className="flex flex-col gap-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-foreground">{plan.name}</h4>
              {isCurrent && <Badge tone="primary">Palier actuel</Badge>}
            </div>

            <p className="text-lg font-semibold text-foreground">
              {formatMoney(plan.price_cents, plan.currency)}
              {plan.price_cents !== null && (
                <span className="text-sm font-normal text-muted"> / {plan.billing_interval === "month" ? "mois" : "an"}</span>
              )}
            </p>

            <ul className="flex flex-col gap-1 text-sm text-muted">
              <li>{plan.max_seats === null ? "Places illimitées" : `${plan.max_seats} place(s)`}</li>
              <li>{plan.max_contacts === null ? "Contacts illimités" : `${plan.max_contacts} contacts`}</li>
              <li>
                {plan.ai_credits_per_month === null
                  ? "Crédits IA illimités"
                  : `${plan.ai_credits_per_month} crédits IA / mois`}
              </li>
              <li>
                {plan.max_knowledge_documents === null
                  ? "Documents illimités"
                  : `${plan.max_knowledge_documents} documents indexables`}
              </li>
            </ul>

            {plan.is_custom ? (
              <p className="text-sm text-muted">Contactez-nous pour cette offre.</p>
            ) : (
              <Button
                type="button"
                variant={isCurrent ? "secondary" : "primary"}
                disabled={isCurrent || pendingPlanSlug !== null}
                isLoading={isPending}
                onClick={() => onSelect(plan.slug)}
              >
                {isCurrent ? "Palier actuel" : "Choisir ce palier"}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
