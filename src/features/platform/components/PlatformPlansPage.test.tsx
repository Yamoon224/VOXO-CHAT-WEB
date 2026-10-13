import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlatformPlansPage } from "@/features/platform/components/PlatformPlansPage";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import * as platformApi from "@/features/platform/api";
import type { Plan } from "@/features/billing/types";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));
vi.mock("@/features/auth/api");
vi.mock("@/features/platform/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const starter: Plan = {
  id: "plan-1",
  slug: "starter",
  name: "Starter",
  price_cents: 1900,
  currency: "EUR",
  billing_interval: "month",
  max_seats: 5,
  max_contacts: 2000,
  ai_credits_per_month: 1000,
  max_knowledge_documents: 200,
  is_custom: false,
  is_active: true,
  sort_order: 1,
  provider_price_id: null,
};

function mockSessionAs(isPlatformAdmin: boolean) {
  vi.mocked(authApi.me).mockResolvedValue({
    data: {
      user: {
        id: "user-self",
        name: "Moi",
        email: "moi@example.test",
        locale: "fr",
        email_verified: true,
        two_factor_enabled: false,
        is_platform_admin: isPlatformAdmin,
        last_login_at: null,
      },
      workspace: null,
      permissions: [],
      workspaces: [],
    },
  });
}

function renderPage() {
  return render(
    <SessionProvider>
      <PlatformPlansPage />
    </SessionProvider>,
  );
}

describe("PlatformPlansPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les paliers pour un administrateur de plateforme", async () => {
    mockSessionAs(true);
    vi.mocked(platformApi.listPlans).mockResolvedValue({ data: [starter] });

    renderPage();

    expect(await screen.findByText("Starter")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renvoie un compte ordinaire sans charger la liste", async () => {
    mockSessionAs(false);

    renderPage();

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/dashboard"));
    expect(platformApi.listPlans).not.toHaveBeenCalled();
  });

  it("cree un palier depuis le formulaire", async () => {
    mockSessionAs(true);
    vi.mocked(platformApi.listPlans).mockResolvedValue({ data: [starter] });
    vi.mocked(platformApi.createPlan).mockResolvedValue({
      data: { ...starter, id: "plan-2", slug: "pro", name: "Pro", sort_order: 2 },
    });
    const user = userEvent.setup();

    renderPage();
    await screen.findByText("Starter");

    await user.type(screen.getByLabelText("Identifiant"), "pro");
    await user.type(screen.getByLabelText("Nom"), "Pro");
    await user.click(screen.getByRole("button", { name: "Créer le palier" }));

    await waitFor(() => expect(screen.getByText("Pro")).toBeInTheDocument());
  });

  it("supprime un palier", async () => {
    mockSessionAs(true);
    vi.mocked(platformApi.listPlans).mockResolvedValue({ data: [starter] });
    vi.mocked(platformApi.deletePlan).mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderPage();
    await screen.findByText("Starter");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Starter")).not.toBeInTheDocument());
  });
});
