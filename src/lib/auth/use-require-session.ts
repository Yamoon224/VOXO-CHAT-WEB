"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session-context";

/**
 * Protège une page qui exige une session. Tant que la vérification initiale
 * n'est pas terminée, l'appelant voit un état de chargement plutôt qu'un
 * aller-retour visible vers /login.
 */
export function useRequireSession() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  return { session, isLoading: isLoading || !session };
}
