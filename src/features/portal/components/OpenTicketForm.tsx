"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useOpenTicketForm } from "@/features/portal/components/useOpenTicketForm";

export function OpenTicketForm({ workspaceId }: { workspaceId: string }) {
  const { email, setEmail, name, setName, subject, setSubject, message, setMessage, isSubmitting, isSubmitted, error, handleSubmit } =
    useOpenTicketForm(workspaceId);

  if (isSubmitted) {
    return (
      <Alert variant="success">
        Votre demande a bien été reçue. Vérifiez votre boîte e-mail : un lien de suivi vient de vous être envoyé.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Adresse e-mail"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field label="Nom" value={name} onChange={(event) => setName(event.target.value)} />
      </div>

      <Field label="Sujet" required value={subject} onChange={(event) => setSubject(event.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="portal-ticket-message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="portal-ticket-message"
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Envoyer ma demande
      </Button>
    </form>
  );
}
