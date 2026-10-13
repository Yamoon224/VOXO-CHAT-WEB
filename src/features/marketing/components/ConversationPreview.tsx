import { Badge, Card } from "@/components/ui";

/**
 * Transcription figée, pas un composant d'inbox réel : montre les deux
 * issues possibles d'une conversation (résolue par l'IA, ou transmise) dans
 * le même visuel que la vraie boîte de réception (`Badge`/`Card`).
 */
export function ConversationPreview() {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="self-end rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground">
          Vous remboursez après 30 jours ?
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="primary">Agent IA</Badge>
          <span className="text-xs text-muted">Résolu en 8 secondes</span>
        </div>
        <p className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground">
          Le remboursement est possible jusqu&apos;à 30 jours après l&apos;achat, sans justification.
          Passé ce délai, seuls les défauts du produit sont couverts.
        </p>
        <p className="text-xs text-muted">📄 Source citée : Politique de remboursement</p>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <p className="self-end rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground">
          Je veux annuler mon abonnement entreprise maintenant.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="neutral">Transmis à Claire</Badge>
          <span className="text-xs text-muted">Confiance insuffisante</span>
        </div>
        <p className="text-sm text-muted">Historique complet transféré, aucune répétition pour le client.</p>
      </div>
    </Card>
  );
}
