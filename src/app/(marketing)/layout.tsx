import type { ReactNode } from "react";
import { MarketingHeader } from "@/features/marketing/components/MarketingHeader";
import { MarketingFooter } from "@/features/marketing/components/MarketingFooter";

/** Site vitrine : pages publiques, aucune ne dépend de la session (sauf `/`, voir sa propre page). */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
