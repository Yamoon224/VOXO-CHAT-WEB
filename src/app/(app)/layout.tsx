import type { ReactNode } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";

/**
 * Tout l'espace connecté dépend de la session, résolue côté client : aucune
 * page de ce groupe ne peut produire de coquille statique. `instant = false`
 * ici couvre l'ensemble du sous-arbre (tableau de bord, réglages) sans le
 * répéter sur chaque page.
 */
export const instant = false;

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
