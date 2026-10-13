"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session-context";
import { Spinner } from "@/components/ui";
import { HomePage } from "@/features/marketing/components/HomePage";

// Dépend de la session résolue côté client (voir `app/(app)/layout.tsx`) :
// un compte connecté est redirigé vers son tableau de bord, un visiteur voit
// la page d'accueil du site vitrine.
export const instant = false;

export default function RootPage() {
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
