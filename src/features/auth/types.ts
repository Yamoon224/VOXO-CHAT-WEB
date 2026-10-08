export type Locale = "fr" | "en";

export type WorkspaceRole = "workspace_owner" | "workspace_admin" | "agent" | "viewer";

export type AssignableWorkspaceRole = Exclude<WorkspaceRole, "workspace_owner">;

export type SessionWorkspace = {
  id: string;
  name: string;
  slug: string;
  role: WorkspaceRole;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  locale: Locale;
  email_verified: boolean;
  two_factor_enabled: boolean;
  is_platform_admin: boolean;
  last_login_at: string | null;
};

export type Session = {
  user: SessionUser;
  workspace: SessionWorkspace | null;
  permissions: string[];
  workspaces: SessionWorkspace[];
};

export type IssuedSession = {
  token: string;
  session: Session;
};
