"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth/session-context";
import { ApiError } from "@/lib/api/errors";

/**
 * Sélecteur de l'espace de travail courant, dans le haut de l'application.
 * N'affiche rien de plus qu'un espace unique : changer d'espace est une
 * fonctionnalité, pas un décor, inutile de l'exposer tant qu'elle ne sert à
 * rien.
 */
export function WorkspaceSwitcher() {
  const { session, switchWorkspace } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  if (!session || session.workspaces.length <= 1) {
    return session?.workspace ? (
      <span className="text-sm font-medium text-foreground">{session.workspace.name}</span>
    ) : null;
  }

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setError(null);
    setIsSwitching(true);
    try {
      await switchWorkspace(event.target.value);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Impossible de changer d'espace de travail.");
    } finally {
      setIsSwitching(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="sr-only" htmlFor="workspace-switcher">
        Espace de travail
      </label>
      <select
        id="workspace-switcher"
        value={session.workspace?.id ?? ""}
        onChange={handleChange}
        disabled={isSwitching}
        className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm font-medium text-foreground"
      >
        {session.workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
