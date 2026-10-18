import { useCallback, useEffect, useState } from "react";

export type DashboardSectionKey = "response-times" | "agent-activity" | "channel-activity" | "top-topics" | "unanswered-questions";

export const DASHBOARD_SECTIONS: { key: DashboardSectionKey; label: string }[] = [
  { key: "response-times", label: "Délais de réponse et de résolution" },
  { key: "agent-activity", label: "Activité par agent" },
  { key: "channel-activity", label: "Activité par canal" },
  { key: "top-topics", label: "Sujets fréquents" },
  { key: "unanswered-questions", label: "Questions sans réponse de la base" },
];

const STORAGE_KEY = "voxo.analytics.hidden-sections";

/**
 * Tableau de bord personnalisable (section 2.12) : chaque carte peut être
 * masquée, un confort propre à ce navigateur — jamais une préférence
 * serveur, donc jamais partagée entre postes.
 */
export function useDashboardSections() {
  const [hidden, setHidden] = useState<Set<DashboardSectionKey>>(new Set());

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHidden(new Set(JSON.parse(stored) as DashboardSectionKey[]));
      }
    } catch {
      // Stockage indisponible (navigation privée, quota) : tout reste visible.
    }
  }, []);

  const toggle = useCallback((key: DashboardSectionKey) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // Tant pis : la préférence ne survivra pas à cette session.
      }

      return next;
    });
  }, []);

  return { isVisible: (key: DashboardSectionKey) => !hidden.has(key), toggle };
}
