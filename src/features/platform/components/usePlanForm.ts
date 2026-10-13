import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { BillingInterval, Plan, PlanWriteInput } from "@/features/billing/types";

function toNullableInt(value: string): number | null {
  return value.trim() === "" ? null : Number(value);
}

/** Formulaire de création/modification d'un palier, console plateforme. */
export function usePlanForm(submit: (input: PlanWriteInput) => Promise<void>, initial: Plan | null) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [priceCents, setPriceCents] = useState(initial?.price_cents?.toString() ?? "");
  const [currency, setCurrency] = useState(initial?.currency ?? "EUR");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(initial?.billing_interval ?? "month");
  const [maxSeats, setMaxSeats] = useState(initial?.max_seats?.toString() ?? "");
  const [maxContacts, setMaxContacts] = useState(initial?.max_contacts?.toString() ?? "");
  const [aiCreditsPerMonth, setAiCreditsPerMonth] = useState(initial?.ai_credits_per_month?.toString() ?? "");
  const [maxKnowledgeDocuments, setMaxKnowledgeDocuments] = useState(initial?.max_knowledge_documents?.toString() ?? "");
  const [isCustom, setIsCustom] = useState(initial?.is_custom ?? false);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState((initial?.sort_order ?? 0).toString());
  const [providerPriceId, setProviderPriceId] = useState(initial?.provider_price_id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function reset() {
    setSlug("");
    setName("");
    setPriceCents("");
    setCurrency("EUR");
    setBillingInterval("month");
    setMaxSeats("");
    setMaxContacts("");
    setAiCreditsPerMonth("");
    setMaxKnowledgeDocuments("");
    setIsCustom(false);
    setIsActive(true);
    setSortOrder("0");
    setProviderPriceId("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({
        slug,
        name,
        price_cents: toNullableInt(priceCents),
        currency,
        billing_interval: billingInterval,
        max_seats: toNullableInt(maxSeats),
        max_contacts: toNullableInt(maxContacts),
        ai_credits_per_month: toNullableInt(aiCreditsPerMonth),
        max_knowledge_documents: toNullableInt(maxKnowledgeDocuments),
        is_custom: isCustom,
        is_active: isActive,
        sort_order: Number(sortOrder),
        provider_price_id: providerPriceId.trim() === "" ? null : providerPriceId,
      });
      if (!initial) {
        reset();
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
