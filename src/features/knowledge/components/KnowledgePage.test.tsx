import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KnowledgePage } from "@/features/knowledge/components/KnowledgePage";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import * as knowledgeApi from "@/features/knowledge/api";
import { ApiError } from "@/lib/api/errors";
import type { KnowledgeDocument, KnowledgeQaEntry, KnowledgeSource } from "@/features/knowledge/types";

vi.mock("@/features/auth/api");
vi.mock("@/features/knowledge/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const source: KnowledgeSource = {
  id: "src-1",
  type: "upload",
  type_label: "Fichiers importés",
  name: "Documentation",
  website_url: null,
  website_sitemap_url: null,
  recrawl_frequency: "manual",
  last_crawled_at: null,
  created_at: "2026-10-08T00:00:00Z",
};

const document: KnowledgeDocument = {
  id: "doc-1",
  source_id: "src-1",
  type: "file",
  type_label: "Fichier importé",
  title: "guide.txt",
  origin_url: null,
  original_filename: "guide.txt",
  mime_type: "text/plain",
  status: "indexed",
  status_label: "Indexé",
  status_message: null,
  chunk_count: 2,
  indexed_at: "2026-10-08T00:01:00Z",
  created_at: "2026-10-08T00:00:00Z",
};

const qaEntry: KnowledgeQaEntry = {
  id: "qa-1",
  question: "Quels sont vos horaires ?",
  answer: "De 9h à 18h.",
  status: "indexed",
  status_label: "Indexé",
  chunk_count: 1,
  created_at: "2026-10-08T00:00:00Z",
};

function mockSessionAs(permissions: string[]) {
  vi.mocked(authApi.me).mockResolvedValue({
    data: {
      user: {
        id: "user-self",
        name: "Moi",
        email: "moi@example.test",
        locale: "fr",
        email_verified: true,
        two_factor_enabled: false,
        is_platform_admin: false,
        last_login_at: null,
      },
      workspace: { id: "w1", name: "Acme", slug: "acme", role: "workspace_admin" },
      permissions,
      workspaces: [{ id: "w1", name: "Acme", slug: "acme", role: "workspace_admin" }],
    },
  });
}

function mockLists() {
  vi.mocked(knowledgeApi.listSources).mockResolvedValue({
    data: [source],
    meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
  });
  vi.mocked(knowledgeApi.listDocuments).mockResolvedValue({
    data: [document],
    meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
  });
  vi.mocked(knowledgeApi.listQaEntries).mockResolvedValue({
    data: [qaEntry],
    meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
  });
}

function renderPage() {
  return render(
    <SessionProvider>
      <KnowledgePage />
    </SessionProvider>,
  );
}

describe("KnowledgePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les sources et les formulaires d'import quand l'appelant gère la base", async () => {
    mockSessionAs(["knowledge.view", "knowledge.manage"]);
    mockLists();

    renderPage();

    expect(await screen.findByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("Importer des fichiers")).toBeInTheDocument();
    expect(screen.getByText("Explorer un site web")).toBeInTheDocument();
  });

  it("masque les formulaires de gestion sans knowledge.manage", async () => {
    mockSessionAs(["knowledge.view"]);
    mockLists();

    renderPage();

    expect(await screen.findByText("Documentation")).toBeInTheDocument();
    expect(screen.queryByText("Importer des fichiers")).not.toBeInTheDocument();
  });

  it("refuse l'accès sans knowledge.view", async () => {
    mockSessionAs([]);
    mockLists();

    renderPage();

    expect(await screen.findByText(/pas accès à la base de connaissances/)).toBeInTheDocument();
  });

  it("affiche une erreur si le chargement échoue", async () => {
    mockSessionAs(["knowledge.view"]);
    vi.mocked(knowledgeApi.listSources).mockRejectedValue(new ApiError(500, "Erreur serveur.", "server_error"));
    vi.mocked(knowledgeApi.listDocuments).mockResolvedValue({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
    vi.mocked(knowledgeApi.listQaEntries).mockResolvedValue({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });

    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent("Erreur serveur.");
  });

  it("navigue vers l'onglet questions/réponses et ajoute une entrée", async () => {
    mockSessionAs(["knowledge.view", "knowledge.manage"]);
    mockLists();
    vi.mocked(knowledgeApi.createQaEntry).mockResolvedValue({
      data: { id: "qa-2", question: "Livrez-vous le dimanche ?", answer: "Non.", status: "pending", status_label: "En attente", chunk_count: 0, created_at: "2026-10-08T00:02:00Z" },
    });
    const user = userEvent.setup();

    renderPage();

    await screen.findByText("Documentation");
    await user.click(screen.getByRole("tab", { name: "Questions / réponses" }));

    await user.type(screen.getByLabelText("Question"), "Livrez-vous le dimanche ?");
    await user.type(screen.getByLabelText("Réponse"), "Non.");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() => expect(screen.getByText("Livrez-vous le dimanche ?")).toBeInTheDocument());
  });
});
