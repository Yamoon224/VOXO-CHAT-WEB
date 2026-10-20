"use client";

import { useState } from "react";
import { Badge, Button } from "@/components/ui";
import { formatDate } from "@/lib/format";

export function ScriptPanel({ script, lastInstalledCheckAt }: { script: string; lastInstalledCheckAt: string | null }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission refusée) :
      // le script reste sélectionnable manuellement, rien d'autre à faire.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        {lastInstalledCheckAt ? (
          <Badge tone="primary">Installé — vu pour la dernière fois le {formatDate(lastInstalledCheckAt)}</Badge>
        ) : (
          <Badge tone="neutral">Installation non détectée pour l&apos;instant</Badge>
        )}
      </div>
      <pre className="overflow-x-auto rounded-md border border-border-strong bg-border/20 p-3 text-xs text-foreground">
        <code>{script}</code>
      </pre>
      <div>
        <Button variant="secondary" type="button" onClick={handleCopy}>
          {copied ? "Copié !" : "Copier le script"}
        </Button>
      </div>
    </div>
  );
}
