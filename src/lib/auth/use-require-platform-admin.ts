"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session-context";

/**
 * Protège la console plateforme. S'utilise à l'intérieur de `AuthGuard` (qui
 * a déjà résolu la session) : ici, seul le rôle `platform_admin` est vérifié.
 */
export function useRequirePlatformAdmin() {
  const { session, isLoading } = useSession();
  const router = useRouter();
  const isPlatformAdmin = session?.user.is_platform_admin ?? false;

  useEffect(() => {
    if (!isLoading && !isPlatformAdmin) {
      router.replace("/dashboard");
    }
  }, [isLoading, isPlatformAdmin, router]);

  return { isAuthorized: isPlatformAdmin };
}
