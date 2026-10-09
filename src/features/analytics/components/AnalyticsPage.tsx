"use client";

import { Alert, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useAnalyticsPage } from "@/features/analytics/components/useAnalyticsPage";
import { DateRangeForm } from "@/features/analytics/components/DateRangeForm";
import { StatCard } from "@/features/analytics/components/StatCard";

/** Écran `/analytics` : vue d'ensemble de l'activité de l'espace courant. */
export function AnalyticsPage() {
  const { loadState, overview, from, to, applyRange } = useAnalyticsPage();

  return (
    <div className="flex flex-col gap-6">
      <DateRangeForm from={from} to={to} onApply={applyRange} />

      {loadState.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Chargement des statistiques…
        </div>
      )}

      {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

      {loadState.status === "ready" && overview && (
        <>
          <p className="text-sm text-muted">
            Du {formatDate(overview.from)} au {formatDate(overview.to)}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Conversations" value={String(overview.conversation_count)} />
            <StatCard label="Messages" value={String(overview.message_count)} />
            <StatCard
              label="Note moyenne"
              value={overview.average_rating === null ? "—" : overview.average_rating.toFixed(1)}
            />
            <StatCard label="Résolues par l'IA" value={String(overview.ai_resolved_count)} />
            <StatCard label="Escaladées" value={String(overview.escalated_count)} />
            <StatCard label="Sans réponse" value={String(overview.unanswered_count)} />
          </div>
        </>
      )}
    </div>
  );
}
