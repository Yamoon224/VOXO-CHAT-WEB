"use client";

import { useRef, type ChangeEvent } from "react";
import Link from "next/link";
import { Alert, Button, Card, EmptyState, Field, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useContactsPage } from "@/features/contacts/components/useContactsPage";
import { ContactForm } from "@/features/contacts/components/ContactForm";

/** Écran `/contacts` : recherche, import/export CSV, création et liste paginée. */
export function ContactsPage() {
  const { loadState, contacts, meta, search, setSearch, actionError, goToPage, create, remove, importCsv, exportCsv } =
    useContactsPage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    await importCsv(file);
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <div>
        <Link href="/contacts/segments" className="text-sm font-medium text-primary hover:underline">
          Gérer les segments →
        </Link>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Nouveau contact</h2>
        <ContactForm onSubmit={create} />
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex items-end gap-2"
          >
            <Field
              label="Rechercher"
              placeholder="Nom ou e-mail"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <Button variant="secondary" type="button" onClick={() => fileInputRef.current?.click()}>
              Importer CSV
            </Button>
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} />
            <Button variant="secondary" type="button" onClick={() => void exportCsv()}>
              Exporter CSV
            </Button>
          </div>
        </div>

        {loadState.status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Spinner size="sm" />
            Chargement des contacts…
          </div>
        )}

        {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

        {loadState.status === "ready" && contacts.length === 0 && (
          <EmptyState title="Aucun contact" description="Ajoutez un contact ou importez un fichier CSV." />
        )}

        {loadState.status === "ready" && contacts.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-border/30 text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">E-mail</th>
                  <th className="px-4 py-2">Téléphone</th>
                  <th className="px-4 py-2">Créé le</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-4 py-2 text-foreground">
                      <Link href={`/contacts/${contact.id}`} className="font-medium hover:text-primary">
                        {contact.name ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-foreground">{contact.email ?? "—"}</td>
                    <td className="px-4 py-2 text-foreground">{contact.phone ?? "—"}</td>
                    <td className="px-4 py-2 text-foreground">{formatDate(contact.created_at)}</td>
                    <td className="px-4 py-2">
                      <Button variant="danger" type="button" onClick={() => remove(contact.id)}>
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <Button
              type="button"
              variant="secondary"
              disabled={meta.current_page <= 1}
              onClick={() => goToPage(meta.current_page - 1)}
            >
              Précédent
            </Button>
            <span>
              Page {meta.current_page} sur {meta.last_page}
            </span>
            <Button
              type="button"
              variant="secondary"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => goToPage(meta.current_page + 1)}
            >
              Suivant
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
