"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function ScriptPanel({ script }: { script: string }) {
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
