/**
 * Formatage partagé des montants et des dates. Centralisé ici pour qu'un
 * format change à un seul endroit plutôt que dans chaque composant qui
 * affiche un prix ou une date.
 */

/** `null` : tarif sur devis (offre grands comptes), pas un montant à afficher. */
export function formatMoney(cents: number | null, currency: string): string {
  if (cents === null) {
    return "Sur devis";
  }

  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

export function formatDate(value: string | null): string {
  if (value === null) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value));
}
