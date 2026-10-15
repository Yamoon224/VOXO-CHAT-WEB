"use client";

import { Alert, Spinner } from "@/components/ui";
import { useChannelConnectionsPage } from "@/features/channels/components/useChannelConnectionsPage";
import { ChannelConnectionCard } from "@/features/channels/components/ChannelConnectionCard";
import { MESSAGING_CHANNELS } from "@/features/channels/types";

/** Omnicanal (lot 5, section 2.5) : WhatsApp, Messenger, Instagram, Telegram, SMS. */
export function ChannelConnectionsPage() {
  const { loadState, connections, update } = useChannelConnectionsPage();

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des canaux de messagerie…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  return (
    <div className="flex flex-col gap-6">
      {MESSAGING_CHANNELS.map((channel) => {
        const connection = connections[channel];

        return connection ? <ChannelConnectionCard key={channel} channel={channel} connection={connection} update={update} /> : null;
      })}
    </div>
  );
}
