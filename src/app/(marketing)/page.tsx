import { MarketingHomeGuard } from "@/features/marketing/components/MarketingHomeGuard";

// Dépend de la session résolue côté client (voir `app/(app)/layout.tsx`) :
// un compte connecté est redirigé vers son tableau de bord, un visiteur voit
// la page d'accueil du site vitrine.
export const instant = false;

export default function RootPage() {
  return <MarketingHomeGuard />;
}
