"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as authApi from "@/features/auth/api";
import { Alert, Spinner } from "@/components/ui";
import { ApiError } from "@/lib/api/errors";

type Status = "verifying" | "success" | "error";

export function VerifyEmailStatus({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    authApi
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus("success");
      })
      .catch((caught) => {
        if (cancelled) return;
        setMessage(caught instanceof ApiError ? caught.message : "Une erreur est survenue.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Vérification de votre adresse en cours…
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="success">Votre adresse e-mail est confirmée.</Alert>
        <Link href="/dashboard" className="text-center text-sm text-primary hover:underline">
          Aller au tableau de bord
        </Link>
      </div>
    );
  }

  return <Alert variant="error">{message ?? "Ce lien de vérification est invalide ou a expiré."}</Alert>;
}
