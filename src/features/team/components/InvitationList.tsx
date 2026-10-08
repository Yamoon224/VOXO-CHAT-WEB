"use client";

import { Badge, Button } from "@/components/ui";
import type { Invitation } from "@/features/team/types";

export function InvitationList({
  invitations,
  onRevoke,
}: {
  invitations: Invitation[];
  onRevoke: (invitationId: string) => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {invitations.map((invitation) => (
        <li key={invitation.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{invitation.email}</p>
            <p className="text-sm text-muted">Invité par {invitation.invited_by ?? "—"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>{invitation.role_label}</Badge>
            <Button variant="ghost" type="button" onClick={() => onRevoke(invitation.id)}>
              Révoquer
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
