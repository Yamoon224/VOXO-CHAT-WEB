"use client";

import type { ReactNode } from "react";
import { useRequireSession } from "@/lib/auth/use-require-session";
import { AppShell } from "@/components/layout/AppShell";
import { Spinner } from "@/components/ui";

/**
 * Protège l'application connectée et habille son contenu. Isolé du layout
 * serveur qui l'appelle : `instant` (voir `app/(app)/layout.tsx`) ne peut pas
 * être déclaré dans un composant client.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading } = useRequireSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
