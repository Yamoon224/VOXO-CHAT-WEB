"use client";

import { Alert, Button, Field } from "@/components/ui";
import { usePlanForm } from "@/features/platform/components/usePlanForm";
import type { Plan, PlanWriteInput } from "@/features/billing/types";

export function PlanForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Plan | null;
  onSubmit: (input: PlanWriteInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    slug,
    setSlug,
    name,
    setName,
    priceCents,
    setPriceCents,
    currency,
    setCurrency,
    billingInterval,
    setBillingInterval,
    maxSeats,
    setMaxSeats,
    maxContacts,
    setMaxContacts,
    aiCreditsPerMonth,
    setAiCreditsPerMonth,
    maxKnowledgeDocuments,
    setMaxKnowledgeDocuments,
    isCustom,
    setIsCustom,
    isActive,
    setIsActive,
    sortOrder,
    setSortOrder,
    providerPriceId,
    setProviderPriceId,
    isSubmitting,
    error,
    handleSubmit,
  } = usePlanForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Identifiant" required value={slug} onChange={(event) => setSlug(event.target.value)} />
        <Field label="Nom" required value={name} onChange={(event) => setName(event.target.value)} />

        <Field
          label="Prix (centimes, vide = sur devis)"
          type="number"
          min={0}
          value={priceCents}
          onChange={(event) => setPriceCents(event.target.value)}
        />
        <Field label="Devise" required maxLength={3} value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="plan-billing-interval" className="text-sm font-medium text-foreground">
            Fréquence de facturation
          </label>
          <select
            id="plan-billing-interval"
            value={billingInterval}
            onChange={(event) => setBillingInterval(event.target.value as "month" | "year")}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            <option value="month">Mensuel</option>
            <option value="year">Annuel</option>
          </select>
        </div>

        <Field
          label="Ordre d'affichage"
          type="number"
          min={0}
          required
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        />

        <Field
          label="Sièges maximum (vide = illimité)"
          type="number"
          min={0}
          value={maxSeats}
          onChange={(event) => setMaxSeats(event.target.value)}
        />
        <Field
          label="Contacts maximum (vide = illimité)"
          type="number"
          min={0}
          value={maxContacts}
          onChange={(event) => setMaxContacts(event.target.value)}
        />
        <Field
          label="Crédits IA / mois (vide = illimité)"
          type="number"
          min={0}
          value={aiCreditsPerMonth}
          onChange={(event) => setAiCreditsPerMonth(event.target.value)}
        />
        <Field
          label="Documents maximum (vide = illimité)"
          type="number"
          min={0}
          value={maxKnowledgeDocuments}
          onChange={(event) => setMaxKnowledgeDocuments(event.target.value)}
        />

        <Field
          label="Identifiant de prix Stripe (facultatif)"
          value={providerPriceId}
          onChange={(event) => setProviderPriceId(event.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={isCustom} onChange={(event) => setIsCustom(event.target.checked)} />
        Offre sur devis (pas de souscription en self-service)
      </label>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
        Actif (visible dans la grille tarifaire)
      </label>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Créer le palier"}
        </Button>
        {initial && onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
