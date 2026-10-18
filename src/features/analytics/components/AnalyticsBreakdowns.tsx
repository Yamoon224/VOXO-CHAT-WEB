import { Card, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type {
  AnalyticsCountByAgent,
  AnalyticsCountByChannel,
  AnalyticsTopCitedDocument,
  AnalyticsUnansweredKnowledgeQuestion,
} from "@/features/analytics/types";
import type { Member } from "@/features/team/types";

const CHANNEL_LABELS: Record<string, string> = {
  widget: "Widget",
  email: "E-mail",
  contact_form: "Formulaire de contact",
  ticket: "Ticket",
  whatsapp: "WhatsApp",
  messenger: "Messenger",
  instagram: "Instagram",
  telegram: "Telegram",
  sms: "SMS",
  x: "X",
  viber: "Viber",
  line: "Line",
  telephony: "Téléphonie",
};

/** Section « Activité par agent » (section 2.12). */
export function AgentActivityList({ rows, members }: { rows: AnalyticsCountByAgent[]; members: Member[] }) {
  if (rows.length === 0) {
    return <EmptyState title="Aucune activité" description="Aucun agent n'a répondu sur cette période." />;
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {rows
        .slice()
        .sort((a, b) => b.count - a.count)
        .map((row) => {
          const member = members.find((candidate) => candidate.user.id === row.user_id);

          return (
            <li key={row.user_id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-foreground">{member?.user.name ?? "Agent supprimé"}</span>
              <span className="font-medium text-foreground">{row.count}</span>
            </li>
          );
        })}
    </ul>
  );
}

/** Section « Activité par canal » (section 2.12). */
export function ChannelActivityList({ rows }: { rows: AnalyticsCountByChannel[] }) {
  if (rows.length === 0) {
    return <EmptyState title="Aucune conversation" description="Aucune conversation ouverte sur cette période." />;
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {rows
        .slice()
        .sort((a, b) => b.count - a.count)
        .map((row) => (
          <li key={row.channel} className="flex items-center justify-between py-2 text-sm">
            <span className="text-foreground">{CHANNEL_LABELS[row.channel] ?? row.channel}</span>
            <span className="font-medium text-foreground">{row.count}</span>
          </li>
        ))}
    </ul>
  );
}

/** Section « Sujets fréquents » (section 2.12) : les documents les plus cités par l'agent IA, approximation sans classification dédiée. */
export function TopCitedDocumentsList({ rows }: { rows: AnalyticsTopCitedDocument[] }) {
  if (rows.length === 0) {
    return <EmptyState title="Aucune citation" description="L'agent IA n'a cité aucun document sur cette période." />;
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {rows.map((row) => (
        <li key={row.title} className="flex items-center justify-between py-2 text-sm">
          <span className="text-foreground">{row.title}</span>
          <span className="font-medium text-foreground">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}

/** Section « Questions sans réponse de la base » (section 2.12) : réponses de l'agent IA sans aucun passage cité. */
export function UnansweredKnowledgeQuestionsList({ count, recent }: { count: number; recent: AnalyticsUnansweredKnowledgeQuestion[] }) {
  if (count === 0) {
    return <EmptyState title="Aucune lacune détectée" description="Chaque réponse de l'agent IA s'est appuyée sur un document." />;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        {count} question{count > 1 ? "s" : ""} répondue{count > 1 ? "s" : ""} sans citer aucun document de la base.
      </p>
      <ul className="flex flex-col divide-y divide-border">
        {recent.map((row, index) => (
          <li key={index} className="flex flex-col gap-0.5 py-2 text-sm">
            <span className="text-foreground">{row.question}</span>
            <span className="text-xs text-muted">{formatDate(row.created_at)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BreakdownCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </Card>
  );
}
