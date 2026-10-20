import type { Session, WidgetMessage, WidgetSettings } from "./types";

/** Appels REST publics du widget (section 2.3) : aucune authentification, le jeton de session porte le périmètre. */
export function createApi(apiBaseUrl: string) {
  const base = apiBaseUrl.replace(/\/$/, "");

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${base}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", Accept: "application/json", ...options.headers },
    });
    if (!response.ok) throw new Error(`voxo-widget: ${response.status}`);
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  return {
    getSettings(workspaceId: string): Promise<{ data: WidgetSettings }> {
      return request(`/public/widget/${workspaceId}/settings`);
    },
    startSession(workspaceId: string): Promise<{ data: Session }> {
      return request(`/public/widget/${workspaceId}/sessions`, { method: "POST" }).then((response) => {
        const { data } = response as { data: { token: string; visitor_id: string } };
        return { data: { token: data.token, visitorId: data.visitor_id } };
      });
    },
    sendMessage(token: string, body: string): Promise<{ data: { conversation_id: string } }> {
      return request("/public/widget/messages", { method: "POST", body: JSON.stringify({ token, body }) });
    },
    listMessages(token: string): Promise<{ data: WidgetMessage[]; meta: { conversation_id: string | null } }> {
      return request(`/public/widget/messages?token=${encodeURIComponent(token)}`);
    },
    rate(token: string, conversationId: string, rating: number, comment?: string): Promise<void> {
      return request("/public/widget/ratings", {
        method: "POST",
        body: JSON.stringify({ token, conversation_id: conversationId, rating, comment }),
      });
    },
  };
}

export type WidgetApi = ReturnType<typeof createApi>;
