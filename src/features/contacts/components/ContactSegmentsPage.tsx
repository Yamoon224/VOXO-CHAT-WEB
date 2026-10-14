"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useContactSegmentsPage } from "@/features/contacts/components/useContactSegmentsPage";
import { ContactSegmentForm } from "@/features/contacts/components/ContactSegmentForm";
import type { SegmentCriterion } from "@/features/contacts/types";

const OPERATOR_LABEL: Record<SegmentCriterion["operator"], string> = {
  equals: "est égal à",
  contains: "contient",
  is_set: "est renseigné",
  is_not_set: "n'est pas renseigné",
};

function describeCriteria(criteria: SegmentCriterion[]): string {
  return criteria
    .map((criterion) => `${criterion.field} ${OPERATOR_LABEL[criterion.operator]}${criterion.value ? ` « ${criterion.value} »` : ""}`)
    .join(" et ");
}

/** Écran `/contacts/segments` : créer, modifier, supprimer un segment, et consulter ses contacts. */
export function ContactSegmentsPage() {
  const { loadState, segments, actionError, create, update, remove, expandedSegmentId, segmentContacts, isLoadingContacts, toggleContacts } =
    useContactSegmentsPage();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des segments…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  const editing = segments.find((segment) => segment.id === editingId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/contacts" className="text-sm font-medium text-primary hover:underline">
        ← Contacts
      </Link>

      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{editing ? "Modifier le segment" : "Nouveau segment"}</h2>
        <ContactSegmentForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={(name, criteria) =>
            editing ? update(editing.id, name, criteria).then(() => setEditingId(null)) : create(name, criteria)
          }
          onCancel={() => setEditingId(null)}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Segments</h2>

        {segments.length === 0 ? (
          <EmptyState title="Aucun segment" description="Regroupez vos contacts par critères communs." />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {segments.map((segment) => (
              <li key={segment.id} className="flex flex-col gap-2 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{segment.name}</p>
                    <p className="text-sm text-muted">{describeCriteria(segment.criteria)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" type="button" onClick={() => toggleContacts(segment.id)}>
                      {expandedSegmentId === segment.id ? "Masquer les contacts" : "Voir les contacts"}
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => setEditingId(segment.id)}>
                      Modifier
                    </Button>
                    <Button variant="danger" type="button" onClick={() => remove(segment.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>

                {expandedSegmentId === segment.id && (
                  <div className="rounded-md border border-border bg-border/10 p-3">
                    {isLoadingContacts ? (
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Spinner size="sm" />
                        Chargement des contacts…
                      </div>
                    ) : segmentContacts.length === 0 ? (
                      <p className="text-sm text-muted">Aucun contact ne correspond à ce segment pour l&apos;instant.</p>
                    ) : (
                      <ul className="flex flex-col gap-1 text-sm">
                        {segmentContacts.map((contact) => (
                          <li key={contact.id}>
                            <Link href={`/contacts/${contact.id}`} className="font-medium text-foreground hover:text-primary">
                              {contact.name ?? contact.email ?? "Sans nom"}
                            </Link>
                            {contact.email && <span className="text-muted"> — {contact.email}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
