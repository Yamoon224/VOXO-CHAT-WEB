import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BillingPage } from "@/features/billing/components/BillingPage";
import { SessionProvider } from "@/lib/auth/session-context";
import * as authApi from "@/features/auth/api";
import * as billingApi from "@/features/billing/api";
import { ApiError } from "@/lib/api/errors";
import type { Plan, Subscription } from "@/features/billing/types";

vi.mock("@/features/auth/api");
vi.mock("@/features/billing/api");
vi.mock("@/lib/auth/token-store", () => ({
  getToken: vi.fn(() => "token-123"),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

const free: Plan = {
  id: "plan-free",
  slug: "free",
  name: "Gratuit",
  price_cents: 0,
  currency: "EUR",
  billing_interval: "month",
  max_seats: 2,
  max_contacts: 200,
  ai_credits_per_month: 100,
  max_knowledge_documents: 20,
  is_custom: false,
  sort_order: 0,
};

const business: Plan = {
  id: "plan-business",
  slug: "business",
  name: "Business",
  price_cents: 4900,
  currency: "EUR",
  billing_interval: "month",
  max_seats: 20,
  max_contacts: 10000,
  ai_credits_per_month: 5000,
  max_knowledge_documents: 1000,
  is_custom: false,
  sort_order: 2,
};

const subscription: Subscription = {
  id: "sub-1",
  status: "active",
  status_label: "Actif",
  plan: business,
  trial_ends_at: null,
  current_period_start: "2026-10-01T00:00:00Z",
  current_period_end: "2026-11-01T00:00:00Z",
  canceled_at: null,
  ai_credit_balance: 80,
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
      workspace: { id: "w1", name: "Acme", slug: "acme", role: "workspace_owner" },
      permissions,
      workspaces: [{ id: "w1", name: "Acme", slug: "acme", role: "workspace_owner" }],
    },
  });
}

function renderPage() {
  return render(
    <SessionProvider>
      <BillingPage />
    </SessionProvider>,
  );
}

describe("BillingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche l'abonnement et les factures, sans la grille sans billing.manage", async () => {
    mockSessionAs(["billing.view"]);
    vi.mocked(billingApi.getSubscription).mockResolvedValue({ data: subscription });
    vi.mocked(billingApi.listPlans).mockResolvedValue({ data: [free, business] });
    vi.mocked(billingApi.listInvoices).mockResolvedValue({ data: [] });

    renderPage();

    expect(await screen.findByText("Business")).toBeInTheDocument();
    expect(screen.queryByText("Changer de palier")).not.toBeInTheDocument();
    expect(screen.getByText("Aucune facture")).toBeInTheDocument();
  });

  it("propose la grille tarifaire avec billing.manage", async () => {
    mockSessionAs(["billing.view", "billing.manage"]);
    vi.mocked(billingApi.getSubscription).mockResolvedValue({ data: subscription });
    vi.mocked(billingApi.listPlans).mockResolvedValue({ data: [free, business] });
    vi.mocked(billingApi.listInvoices).mockResolvedValue({ data: [] });

    renderPage();

    expect(await screen.findByText("Changer de palier")).toBeInTheDocument();
  });

  it("basculer vers le palier gratuit met à jour l'abonnement affiché", async () => {
    mockSessionAs(["billing.view", "billing.manage"]);
    vi.mocked(billingApi.getSubscription).mockResolvedValue({ data: subscription });
    vi.mocked(billingApi.listPlans).mockResolvedValue({ data: [free, business] });
    vi.mocked(billingApi.listInvoices).mockResolvedValue({ data: [] });
    vi.mocked(billingApi.switchToFreePlan).mockResolvedValue({ data: { ...subscription, plan: free } });

    const user = userEvent.setup();
    renderPage();

    await screen.findByText("Changer de palier");
    await user.click(screen.getByRole("button", { name: "Choisir ce palier" }));

    expect(billingApi.switchToFreePlan).toHaveBeenCalled();
    await waitFor(() => expect(screen.getAllByText("Gratuit").length).toBeGreaterThan(0));
  });

  it("affiche une erreur si le chargement échoue", async () => {
    mockSessionAs(["billing.view"]);
    vi.mocked(billingApi.getSubscription).mockRejectedValue(new ApiError(403, "Accès refusé.", "forbidden"));
    vi.mocked(billingApi.listPlans).mockResolvedValue({ data: [] });
    vi.mocked(billingApi.listInvoices).mockResolvedValue({ data: [] });

    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent("Accès refusé.");
  });
});
