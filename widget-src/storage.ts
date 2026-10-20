import type { Session } from "./types";

/** Une session par espace, pour qu'un visiteur revenant retrouve sa conversation sans en rouvrir une nouvelle. */
function key(workspaceId: string): string {
  return `voxo-widget-session:${workspaceId}`;
}

export function loadSession(workspaceId: string): Session | null {
  try {
    const raw = window.localStorage.getItem(key(workspaceId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    return typeof parsed.token === "string" && typeof parsed.visitorId === "string" ? (parsed as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(workspaceId: string, session: Session): void {
  try {
    window.localStorage.setItem(key(workspaceId), JSON.stringify(session));
  } catch {
    // Stockage indisponible (navigation privée...) : la session vit pour l'onglet courant, rien de plus.
  }
}
