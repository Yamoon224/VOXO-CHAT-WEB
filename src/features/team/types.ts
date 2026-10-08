import type { AssignableWorkspaceRole } from "@/features/auth/types";
import type { Member } from "@/features/workspace/types";

export type { Member };

export type Invitation = {
  id: string;
  email: string;
  role: AssignableWorkspaceRole;
  role_label: string;
  invited_by: string | null;
  expires_at: string;
  created_at: string;
};

export type PaginatedMembers = {
  data: Member[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};
