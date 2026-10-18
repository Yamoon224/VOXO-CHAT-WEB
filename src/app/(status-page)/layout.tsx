import type { ReactNode } from "react";

/** Page de statut publique (section 2.11) : aucune page de ce groupe ne dépend de la session. */
export const instant = false;

export default function StatusPageLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
