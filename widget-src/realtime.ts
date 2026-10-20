import Echo from "laravel-echo";
import Pusher from "pusher-js";
import type { WidgetMessage, WidgetSettings } from "./types";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

export type RealtimeHandle = {
  sendTyping: () => void;
  disconnect: () => void;
};

/**
 * `null` si aucun serveur Reverb n'est configuré (`settings.realtime`,
 * section 4.1) : l'appelant retombe alors sur le sondage.
 */
export function connectRealtime(
  settings: WidgetSettings,
  apiBaseUrl: string,
  visitorToken: string,
  conversationId: string,
  onMessage: (message: WidgetMessage) => void,
  onAgentTyping: () => void,
  onAgentPresence: (present: boolean) => void,
): RealtimeHandle | null {
  if (!settings.realtime) return null;

  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: "reverb",
    key: settings.realtime.key,
    wsHost: settings.realtime.host,
    wsPort: settings.realtime.port,
    wssPort: settings.realtime.port,
    forceTLS: settings.realtime.scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${apiBaseUrl.replace(/\/api\/v1\/?$/, "")}/broadcasting/auth`,
    auth: { headers: { "X-Visitor-Token": visitorToken } },
  });

  const channelName = `conversation.${conversationId}.public`;
  const channel = echo.join(channelName);

  channel.listen(".message.created", (message: WidgetMessage) => onMessage(message));
  channel
    .here((members: { id: string }[]) => onAgentPresence(members.some((member) => !member.id.startsWith("visitor:"))))
    .joining((member: { id: string }) => {
      if (!member.id.startsWith("visitor:")) onAgentPresence(true);
    })
    .leaving((member: { id: string }) => {
      if (!member.id.startsWith("visitor:")) onAgentPresence(false);
    })
    .listenForWhisper("typing", () => onAgentTyping());

  return {
    sendTyping: () => channel.whisper("typing", {}),
    disconnect: () => {
      echo.leave(channelName);
      echo.disconnect();
    },
  };
}
