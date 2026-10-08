import type { ReactNode } from "react";

/**
 * Les écrans publics (connexion, inscription, invitation…) lisent `searchParams`
 * ou dépendent de la session côté client : comme pour `(app)`, aucun ne peut
 * produire de coquille statique.
 */
export const instant = false;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
