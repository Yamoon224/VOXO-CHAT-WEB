import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkspaceSettingsForm } from "@/features/workspace/components/WorkspaceSettingsForm";
import { SessionProvider } from "@/lib/auth/session-context";
import * as workspaceApi from "@/features/workspace/api";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

vi.mock("@/features/workspace/api");
vi.mock("@/features/auth/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const workspace = {
  id: "w1",
  name: "Acme",
  slug: "acme",
  locale: "fr" as const,
  timezone: "UTC",
  created_at: "2026-10-01T00:00:00Z",
};

function renderForm() {
  return render(
    <SessionProvider>
      <WorkspaceSettingsForm />
    </SessionProvider>,
  );
}

describe("WorkspaceSettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authApi.me).mockRejectedValue(new ApiError(401, "Non authentifié.", "unauthenticated"));
  });

  it("charge puis enregistre les réglages de l'espace", async () => {
    vi.mocked(workspaceApi.currentWorkspace).mockResolvedValue({ data: workspace });
    vi.mocked(workspaceApi.updateWorkspace).mockResolvedValue({ data: { ...workspace, name: "Acme Corp" } });

    const user = userEvent.setup();
    renderForm();

    const nameField = await screen.findByLabelText("Nom de l'espace de travail");
    expect(nameField).toHaveValue("Acme");
    expect(screen.getByText(/acme/)).toBeInTheDocument();

    await user.clear(nameField);
    await user.type(nameField, "Acme Corp");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(await screen.findByText("Réglages enregistrés.")).toBeInTheDocument();
    expect(workspaceApi.updateWorkspace).toHaveBeenCalledWith({ name: "Acme Corp" });
  });

  it("affiche une erreur de chargement", async () => {
    vi.mocked(workspaceApi.currentWorkspace).mockRejectedValue(
      new ApiError(403, "Vous n'avez pas accès à cet espace de travail.", "workspace_scope_violation"),
    );

    renderForm();

    expect(await screen.findByRole("alert")).toHaveTextContent("pas accès");
  });
});
