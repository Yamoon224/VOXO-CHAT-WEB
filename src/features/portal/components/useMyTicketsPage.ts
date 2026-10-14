import { useCallback, useEffect, useState } from "react";
import * as portalApi from "@/features/portal/api";
import { ApiError } from "@/lib/api/errors";
import type { PortalTicket } from "@/features/portal/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useMyTicketsPage(token: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [tickets, setTickets] = useState<PortalTicket[]>([]);

  const load = useCallback(async () => {
    try {
      const { data } = await portalApi.listMyTickets(token);
      setTickets(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  return { loadState, tickets };
}
