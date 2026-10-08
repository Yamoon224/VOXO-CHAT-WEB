import type { AssignableWorkspaceRole } from "@/features/auth/types";

export type InvitationPreview = {
  email: string;
  workspace_name: string;
  role: AssignableWorkspaceRole;
  role_label: string;
  invited_by: string | null;
  expires_at: string;
  account_exists: boolean;
};

export type AcceptedInvitation = {
  token: string | null;
  workspace_id: string;
};
