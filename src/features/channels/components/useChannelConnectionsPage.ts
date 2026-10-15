import { useCallback, useEffect, useState } from "react";
import * as channelsApi from "@/features/channels/api";
import { ApiError } from "@/lib/api/errors";
import { MESSAGING_CHANNELS, type ChannelConnection, type MessagingChannel } from "@/features/channels/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useChannelConnectionsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [connections, setConnections] = useState<Partial<Record<MessagingChannel, ChannelConnection>>>({});
  const [actionErrors, setActionErrors] = useState<Partial<Record<MessagingChannel, ApiError>>>({});

  const load = useCallback(async () => {
    try {
      const results = await Promise.all(MESSAGING_CHANNELS.map((channel) => channelsApi.getChannelConnection(channel)));
      setConnections(Object.fromEntries(MESSAGING_CHANNELS.map((channel, index) => [channel, results[index].data])));
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(channel: MessagingChannel, payload: { enabled?: boolean; credentials?: Record<string, string> }) {
    setActionErrors((previous) => ({ ...previous, [channel]: undefined }));
    try {
      const { data } = await channelsApi.updateChannelConnection(channel, payload);
      setConnections((previous) => ({ ...previous, [channel]: data }));
    } catch (caught) {
      const error = caught instanceof ApiError ? caught : ApiError.networkError();
      setActionErrors((previous) => ({ ...previous, [channel]: error }));
      throw error;
    }
  }

  return { loadState, connections, actionErrors, update };
}
