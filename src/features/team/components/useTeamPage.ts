import { useCallback, useEffect, useState } from "react";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { AssignableWorkspaceRole } from "@/features/auth/types";
import type { Invitation, Member } from "@/features/team/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/**
 * Équipe de l'espace de travail courant : membres et invitations en attente,
 * avec leurs actions. Une seule source de vérité pour l'écran `/settings/team`.
 */
export function useTeamPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [membersResponse, invitationsResponse] = await Promise.all([
        teamApi.listMembers(),
        teamApi.listInvitations(),
      ]);
      setMembers(membersResponse.data);
      setInvitations(invitationsResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeRole(memberId: string, role: AssignableWorkspaceRole) {
    setActionError(null);
    try {
      const { data } = await teamApi.updateMemberRole(memberId, role);
      setMembers((current) => current.map((member) => (member.id === memberId ? data : member)));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function removeMember(memberId: string) {
    setActionError(null);
    try {
      await teamApi.removeMember(memberId);
      setMembers((current) => current.filter((member) => member.id !== memberId));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function invite(email: string, role: AssignableWorkspaceRole) {
    const { data } = await teamApi.inviteMember(email, role);
    setInvitations((current) => [data, ...current]);
  }

  async function revokeInvitation(invitationId: string) {
    setActionError(null);
    try {
      await teamApi.revokeInvitation(invitationId);
      setInvitations((current) => current.filter((invitation) => invitation.id !== invitationId));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, members, invitations, actionError, changeRole, removeMember, invite, revokeInvitation };
}
