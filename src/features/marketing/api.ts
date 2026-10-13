import { apiFetch } from "@/lib/api/client";
import type { Plan } from "@/features/billing/types";

/** Grille tarifaire publique, consommée par la page `/tarifs` (site vitrine) : aucun compte requis. */
export function listPublicPlans(): Promise<{ data: Plan[] }> {
  return apiFetch("/public/plans", { withAuth: false });
}
