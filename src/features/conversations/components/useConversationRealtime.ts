import { useEffect, useRef, useState } from "react";
import { getEcho } from "@/lib/realtime/echo";
import type { Message } from "@/features/conversations/types";

type PresenceMember = { id: string; name: string };

/**
 * Deux canaux par conversation (section 4.1) : `conversation.{id}` (privé,
 * agent — tous les messages) pour le fil, `conversation.{id}.public`
 * (présence) pour l'indicateur de saisie et la présence du visiteur. Rendu
 * indisponible (`available: false`) si aucun serveur Reverb n'est configuré
 * — l'appelant retombe alors sur le sondage, comme avant ce lot.
 */
export function useConversationRealtime(conversationId: string, onMessage: (message: Message) => void) {
  const [typingVisitor, setTypingVisitor] = useState(false);
  const [visitorPresent, setVisitorPresent] = useState(false);
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const echo = getEcho();

  useEffect(() => {
    if (!echo) return;

    const privateChannel = echo.private(`conversation.${conversationId}`);
    privateChannel.listen(".message.created", (message: Message) => onMessageRef.current(message));

    const publicChannel = echo.join(`conversation.${conversationId}.public`);
    let typingTimeout: ReturnType<typeof setTimeout> | undefined;

    publicChannel
      .here((members: PresenceMember[]) => setVisitorPresent(members.some((member) => member.id.startsWith("visitor:"))))
      .joining((member: PresenceMember) => {
        if (member.id.startsWith("visitor:")) setVisitorPresent(true);
      })
      .leaving((member: PresenceMember) => {
        if (member.id.startsWith("visitor:")) setVisitorPresent(false);
      })
      .listenForWhisper("typing", () => {
        setTypingVisitor(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setTypingVisitor(false), 4000);
      });

    return () => {
      clearTimeout(typingTimeout);
      setTypingVisitor(false);
      setVisitorPresent(false);
      echo.leave(`conversation.${conversationId}`);
      echo.leave(`conversation.${conversationId}.public`);
    };
  }, [echo, conversationId]);

  function sendTyping() {
    echo?.join(`conversation.${conversationId}.public`).whisper("typing", {});
  }

  return { available: echo !== null, typingVisitor, visitorPresent, sendTyping };
}
