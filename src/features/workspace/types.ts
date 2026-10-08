import type { Locale, SessionWorkspace, WorkspaceRole } from "@/features/auth/types";

export type Membership = SessionWorkspace;

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  locale: Locale;
  timezone: string;
  created_at: string;
};

export type Member = {
  id: string;
  role: WorkspaceRole;
  role_label: string;
  joined_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    last_login_at: string | null;
  };
};
