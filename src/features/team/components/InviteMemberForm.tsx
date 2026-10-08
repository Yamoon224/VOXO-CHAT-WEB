"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useInviteMemberForm } from "@/features/team/components/useInviteMemberForm";
import type { AssignableWorkspaceRole } from "@/features/auth/types";

const ROLE_OPTIONS: { value: AssignableWorkspaceRole; label: string }[] = [
  { value: "workspace_admin", label: "Administrateur" },
  { value: "agent", label: "Agent" },
  { value: "viewer", label: "Lecteur" },
];

export function InviteMemberForm({ invite }: { invite: (email: string, role: AssignableWorkspaceRole) => Promise<void> }) {
  const { email, setEmail, role, setRole, isSubmitting, error, handleSubmit } = useInviteMemberForm(invite);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {error && (
        <div className="sm:basis-full">
          <Alert variant="error">{error.message}</Alert>
        </div>
      )}

      <div className="flex-1">
        <Field
          label="Adresse e-mail"
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="invite-role" className="text-sm font-medium text-foreground">
          Rôle
        </label>
        <select
          id="invite-role"
          value={role}
          onChange={(event) => setRole(event.target.value as AssignableWorkspaceRole)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Inviter
      </Button>
    </form>
  );
}
