"use client";

import { Alert, Card, EmptyState, Spinner } from "@/components/ui";
import { useSession } from "@/lib/auth/session-context";
import { useTeamPage } from "@/features/team/components/useTeamPage";
import { MemberList } from "@/features/team/components/MemberList";
import { InvitationList } from "@/features/team/components/InvitationList";
import { InviteMemberForm } from "@/features/team/components/InviteMemberForm";

/** Écran `/settings/team` : membres, invitations en attente, formulaire d'invitation. */
export function TeamPage() {
  const { session } = useSession();
  const { loadState, members, invitations, actionError, changeRole, removeMember, invite, revokeInvitation } =
    useTeamPage();

  const canManage = session?.permissions.includes("members.manage") ?? false;

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement de l&apos;équipe…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  return (
    <div className="flex flex-col gap-8">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      {canManage && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Inviter un coéquipier</h2>
          <InviteMemberForm invite={invite} />
        </Card>
      )}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Membres</h2>
        {members.length === 0 ? (
          <EmptyState title="Aucun membre" />
        ) : (
          <MemberList
            members={members}
            currentUserId={session?.user.id ?? ""}
            onChangeRole={changeRole}
            onRemove={removeMember}
          />
        )}
      </Card>

      {canManage && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Invitations en attente</h2>
          {invitations.length === 0 ? (
            <EmptyState title="Aucune invitation en attente" />
          ) : (
            <InvitationList invitations={invitations} onRevoke={revokeInvitation} />
          )}
        </Card>
      )}
    </div>
  );
}
