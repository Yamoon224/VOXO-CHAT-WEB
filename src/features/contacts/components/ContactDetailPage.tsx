"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useContactDetailPage } from "@/features/contacts/components/useContactDetailPage";
import { ContactProfileForm } from "@/features/contacts/components/ContactProfileForm";

const EVENT_LABELS: Record<string, string> = {
  note_added: "Note ajoutée",
  imported: "Importé depuis un CSV",
};

export function ContactDetailPage({ contactId }: { contactId: string }) {
  const { loadState, contact, notes, events, actionError, update, addNote } = useContactDetailPage(contactId);
  const [noteBody, setNoteBody] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement du contact…
      </div>
    );
  }

  if (loadState.status === "error" || contact === null) {
    return <Alert variant="error">{loadState.status === "error" ? loadState.error.message : "Contact introuvable."}</Alert>;
  }

  async function handleAddNote(event: FormEvent) {
    event.preventDefault();
    if (noteBody.trim() === "") return;
    setIsAddingNote(true);
    try {
      await addNote(noteBody);
      setNoteBody("");
    } finally {
      setIsAddingNote(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Profil</h2>
          <ContactProfileForm contact={contact} update={update} />
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Historique</h2>
          {events.length === 0 ? (
            <p className="text-sm text-muted">Aucun évènement pour l&apos;instant.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {events.map((item) => (
                <li key={item.id} className="flex items-center justify-between border-b border-border pb-2 last:border-b-0">
                  <span className="text-foreground">{EVENT_LABELS[item.type] ?? item.type}</span>
                  <span className="text-muted">{formatDate(item.occurred_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Notes</h2>
        <form onSubmit={handleAddNote} className="mb-4 flex flex-col gap-2">
          <label htmlFor="contact-note-body" className="text-sm font-medium text-foreground">
            Ajouter une note
          </label>
          <textarea
            id="contact-note-body"
            rows={2}
            value={noteBody}
            onChange={(event) => setNoteBody(event.target.value)}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          />
          <div>
            <Button type="submit" isLoading={isAddingNote}>
              Ajouter
            </Button>
          </div>
        </form>

        {notes.length === 0 ? (
          <p className="text-sm text-muted">Aucune note pour l&apos;instant.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {notes.map((note) => (
              <li key={note.id} className="py-3">
                <p className="text-sm text-foreground">{note.body}</p>
                <p className="text-xs text-muted">
                  {note.author_name ?? "Système"} · {formatDate(note.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
