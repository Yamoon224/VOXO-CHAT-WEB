import type { ReactNode } from "react";

/** Portail client, sans compte (section 2.7) : aucune page de ce groupe ne dépend de la session. */
export const instant = false;

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
