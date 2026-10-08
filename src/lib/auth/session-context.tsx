"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "@/features/auth/api";
import * as workspaceApi from "@/features/workspace/api";
import { clearToken, getToken, setToken } from "@/lib/auth/token-store";
import type { IssuedSession, Session } from "@/features/auth/types";
import { ApiError } from "@/lib/api/errors";

type SessionState = {
  session: Session | null;
  /** `true` tant que la session initiale n'a pas été résolue (jeton vérifié ou non). */
  isLoading: boolean;
  applyIssuedSession: (issued: IssuedSession) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await authApi.me();
      setSession(data);
    } catch (error) {
      // Un jeton expiré ou révoqué ne doit pas laisser l'appelant pour
      // authentifié aux yeux de l'interface : il repart à l'état déconnecté.
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        clearToken();
      }
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    // Volontairement une seule fois au montage : les mutations qui changent
    // la session (connexion, bascule d'espace) appellent `refresh` ou
    // `applyIssuedSession` elles-mêmes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyIssuedSession = useCallback((issued: IssuedSession) => {
    setToken(issued.token);
    setSession(issued.session);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearToken();
      setSession(null);
    }
  }, []);

  const switchWorkspace = useCallback(
    async (workspaceId: string) => {
      await workspaceApi.switchWorkspace(workspaceId);
      await refresh();
    },
    [refresh],
  );

  return (
    <SessionContext.Provider value={{ session, isLoading, applyIssuedSession, refresh, logout, switchWorkspace }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession doit être utilisé à l'intérieur de <SessionProvider>.");
  }
  return context;
}
