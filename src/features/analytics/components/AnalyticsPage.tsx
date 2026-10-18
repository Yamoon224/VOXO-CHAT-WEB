"use client";

import { Alert, Button, Spinner } from "@/components/ui";
import { formatDate, formatDuration } from "@/lib/format";
import { useAnalyticsPage } from "@/features/analytics/components/useAnalyticsPage";
import { useDashboardSections } from "@/features/analytics/components/useDashboardSections";
import { DateRangeForm } from "@/features/analytics/components/DateRangeForm";
import { StatCard } from "@/features/analytics/components/StatCard";
import { DashboardSectionToggles } from "@/features/analytics/components/DashboardSectionToggles";
import {
  AgentActivityList,
  BreakdownCard,
  ChannelActivityList,
  TopCitedDocumentsList,
  UnansweredKnowledgeQuestionsList,
} from "@/features/analytics/components/AnalyticsBreakdowns";

/** Écran `/analytics` : vue d'ensemble de l'activité de l'espace courant (section 2.12). */
export function AnalyticsPage() {
  const { loadState, overview, members, from, to, applyRange, isExporting, exportError, exportCsv } = useAnalyticsPage();
  const { isVisible, toggle } = useDashboardSections();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <DateRangeForm from={from} to={to} onApply={applyRange} />
        <Button variant="secondary" type="button" isLoading={isExporting} onClick={() => void exportCsv()}>
          Exporter CSV
        </Button>
      </div>

      {exportError && <Alert variant="error">{exportError.message}</Alert>}

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

          {isVisible("response-times") && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard label="Délai moyen de première réponse" value={formatDuration(overview.average_first_response_seconds)} />
              <StatCard label="Délai moyen de résolution" value={formatDuration(overview.average_resolution_seconds)} />
            </div>
          )}

          {isVisible("agent-activity") && (
            <BreakdownCard title="Activité par agent">
              <AgentActivityList rows={overview.messages_by_agent} members={members} />
            </BreakdownCard>
          )}

          {isVisible("channel-activity") && (
            <BreakdownCard title="Activité par canal">
              <ChannelActivityList rows={overview.conversations_by_channel} />
            </BreakdownCard>
          )}

          {isVisible("top-topics") && (
            <BreakdownCard title="Sujets fréquents">
              <TopCitedDocumentsList rows={overview.top_cited_documents} />
            </BreakdownCard>
          )}

          {isVisible("unanswered-questions") && (
            <BreakdownCard title="Questions sans réponse de la base">
              <UnansweredKnowledgeQuestionsList
                count={overview.unanswered_knowledge_questions_count}
                recent={overview.recent_unanswered_knowledge_questions}
              />
            </BreakdownCard>
          )}

          <DashboardSectionToggles isVisible={isVisible} toggle={toggle} />
        </>
      )}
    </div>
  );
}
