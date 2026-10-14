import type { ReactNode } from "react";

/** Centre d'aide public (section 2.10) : aucune page de ce groupe ne dépend de la session. */
export const instant = false;

export default function HelpCenterLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
