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

/** Secondes vers un format lisible ("45 s", "12 min", "3 h 20 min") — pour les délais de réponse et de résolution (section 2.12). */
export function formatDuration(seconds: number | null): string {
  if (seconds === null) {
    return "—";
  }

  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  }

  if (minutes > 0) {
    return `${minutes} min`;
  }

  return `${totalSeconds} s`;
}
