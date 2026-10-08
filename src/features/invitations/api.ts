import { apiFetch } from "@/lib/api/client";
import type { AcceptedInvitation, InvitationPreview } from "@/features/invitations/types";

export function previewInvitation(token: string): Promise<{ data: InvitationPreview }> {
  return apiFetch(`/invitations/${token}`, { withAuth: false });
}

/**
 * `name`/`password` ne sont nécessaires que si l'invité n'a pas encore de
 * compte ; `withAuth: true` pour qu'un visiteur déjà connecté accepte en son
 * propre nom, sans que ce soit une erreur pour un visiteur anonyme (le jeton
 * est alors simplement absent).
 */
export function acceptInvitation(
  token: string,
  input: { name?: string; password?: string; password_confirmation?: string },
): Promise<{ data: AcceptedInvitation }> {
  return apiFetch(`/invitations/${token}/accept`, { method: "POST", body: input, withAuth: true });
}
