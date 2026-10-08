import { apiFetch } from "@/lib/api/client";
import type { AssignableWorkspaceRole } from "@/features/auth/types";
import type { Invitation, Member, PaginatedMembers } from "@/features/team/types";

export function listMembers(): Promise<PaginatedMembers> {
  return apiFetch("/workspace/members");
}

export function updateMemberRole(memberId: string, role: AssignableWorkspaceRole): Promise<{ data: Member }> {
  return apiFetch(`/workspace/members/${memberId}`, { method: "PUT", body: { role } });
}

export function removeMember(memberId: string): Promise<void> {
  return apiFetch(`/workspace/members/${memberId}`, { method: "DELETE" });
}

export function listInvitations(): Promise<{ data: Invitation[] }> {
  return apiFetch("/workspace/invitations");
}

export function inviteMember(email: string, role: AssignableWorkspaceRole): Promise<{ data: Invitation }> {
  return apiFetch("/workspace/invitations", { method: "POST", body: { email, role } });
}

export function revokeInvitation(invitationId: string): Promise<void> {
  return apiFetch(`/workspace/invitations/${invitationId}`, { method: "DELETE" });
}
