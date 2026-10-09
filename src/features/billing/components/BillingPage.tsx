"use client";

import { Alert, Card, EmptyState, Spinner } from "@/components/ui";
import { useSession } from "@/lib/auth/session-context";
import { useBillingPage } from "@/features/billing/components/useBillingPage";
import { SubscriptionSummary } from "@/features/billing/components/SubscriptionSummary";
import { PlanGrid } from "@/features/billing/components/PlanGrid";
import { InvoiceList } from "@/features/billing/components/InvoiceList";

/** Écran `/settings/billing` : abonnement, grille tarifaire, factures. */
export function BillingPage() {
  const { session } = useSession();
  const { loadState, subscription, plans, invoices, actionError, pendingPlanSlug, changeToPlan, cancelSubscription } =
    useBillingPage();

  const canManage = session?.permissions.includes("billing.manage") ?? false;

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement de la facturation…
      </div>
    );
  }

  if (loadState.status === "error" || subscription === null) {
    return <Alert variant="error">{loadState.status === "error" ? loadState.error.message : "Abonnement introuvable."}</Alert>;
  }

  return (
    <div className="flex flex-col gap-8">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Abonnement</h2>
        <SubscriptionSummary subscription={subscription} canManage={canManage} onCancel={cancelSubscription} />
      </Card>

      {canManage && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Changer de palier</h2>
          <PlanGrid
            plans={plans}
            currentPlanSlug={subscription.plan.slug}
            pendingPlanSlug={pendingPlanSlug}
            onSelect={changeToPlan}
          />
        </Card>
      )}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Factures</h2>
        {invoices.length === 0 ? <EmptyState title="Aucune facture" /> : <InvoiceList invoices={invoices} />}
      </Card>
    </div>
  );
}
