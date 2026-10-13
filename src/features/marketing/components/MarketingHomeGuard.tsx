"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session-context";
import { Spinner } from "@/components/ui";
import { HomePage } from "@/features/marketing/components/HomePage";

/**
 * Isolé du segment serveur qui l'appelle : `instant` (voir `app/(marketing)/page.tsx`)
 * ne peut pas être déclaré dans un composant client, même pattern que `AuthGuard`.
 */
export function MarketingHomeGuard() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [isLoading, session, router]);

  if (isLoading || session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <HomePage />;
}
