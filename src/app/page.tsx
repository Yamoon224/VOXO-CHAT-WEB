"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session-context";
import { Spinner } from "@/components/ui";

/** Porte d'entrée : redirige vers le tableau de bord ou vers la connexion, selon la session. */
export default function Home() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(session ? "/dashboard" : "/login");
  }, [isLoading, session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
