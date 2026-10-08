"use client";

import { Card } from "@/components/ui";
import { useSession } from "@/lib/auth/session-context";

/**
 * Écran d'accueil du lot 0 : confirme que la connexion et l'espace de travail
 * fonctionnent. Les indicateurs réels (conversations, résolution par l'IA)
 * arrivent avec les lots qui en produisent la donnée.
 */
export function DashboardOverview() {
  const { session } = useSession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Bonjour {session?.user.name}</h1>
        <p className="text-sm text-muted">
          Vous travaillez dans <strong className="text-foreground">{session?.workspace?.name}</strong>.
        </p>
      </div>

      {session && !session.user.email_verified && (
        <Card className="border-primary/40 bg-primary/5">
          <p className="text-sm text-foreground">
            Confirmez votre adresse e-mail pour sécuriser votre compte. Vérifiez votre boîte de réception.
          </p>
        </Card>
      )}

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Prochaines étapes</h2>
        <ul className="list-inside list-disc text-sm text-muted">
          <li>Invitez votre équipe depuis les réglages de l&apos;espace de travail.</li>
          <li>Personnalisez le nom de votre espace de travail.</li>
        </ul>
      </Card>
    </div>
  );
}
