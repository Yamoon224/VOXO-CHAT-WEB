"use client";

import { Badge, Button } from "@/components/ui";
import type { AssignableWorkspaceRole } from "@/features/auth/types";
import type { Member } from "@/features/team/types";

const ROLE_OPTIONS: { value: AssignableWorkspaceRole; label: string }[] = [
  { value: "workspace_admin", label: "Administrateur" },
  { value: "agent", label: "Agent" },
  { value: "viewer", label: "Lecteur" },
];

export function MemberList({
  members,
  currentUserId,
  onChangeRole,
  onRemove,
}: {
  members: Member[];
  currentUserId: string;
  onChangeRole: (memberId: string, role: AssignableWorkspaceRole) => void;
  onRemove: (memberId: string) => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {members.map((member) => {
        // Le propriétaire et le compte de l'appelant lui-même ne proposent pas
        // ces actions : le serveur les refuserait de toute façon, autant ne
        // pas faire croire que l'action est possible. Comparaison sur le
        // compte (`member.user.id`), pas sur l'adhésion (`member.id`) : ce
        // sont deux identifiants distincts.
        const isProtected = member.role === "workspace_owner" || member.user.id === currentUserId;

        return (
          <li key={member.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{member.user.name}</p>
              <p className="text-sm text-muted">{member.user.email}</p>
            </div>

            <div className="flex items-center gap-3">
              {isProtected ? (
                <Badge tone="primary">{member.role_label}</Badge>
              ) : (
                <>
                  <label className="sr-only" htmlFor={`role-${member.id}`}>
                    Rôle de {member.user.name}
                  </label>
                  <select
                    id={`role-${member.id}`}
                    value={member.role}
                    onChange={(event) => onChangeRole(member.id, event.target.value as AssignableWorkspaceRole)}
                    className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button variant="danger" type="button" onClick={() => onRemove(member.id)}>
                    Retirer
                  </Button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
