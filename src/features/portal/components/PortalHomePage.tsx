"use client";

import { Card } from "@/components/ui";
import { OpenTicketForm } from "@/features/portal/components/OpenTicketForm";
import { RequestPortalLinkForm } from "@/features/portal/components/RequestPortalLinkForm";

/** Écran `/portal/[workspace]` : ouvrir une nouvelle demande, ou retrouver un lien de suivi déjà reçu. */
export function PortalHomePage({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Besoin d&apos;aide ?</h1>
        <p className="mt-1 text-sm text-muted">Décrivez votre demande, nous vous répondrons par ce même fil.</p>
      </div>

      <Card>
        <OpenTicketForm workspaceId={workspaceId} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Vous avez déjà une demande en cours ?</h2>
        <RequestPortalLinkForm workspaceId={workspaceId} />
      </Card>
    </div>
  );
}
