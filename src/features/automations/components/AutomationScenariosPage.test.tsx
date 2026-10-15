import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AutomationScenariosPage } from "@/features/automations/components/AutomationScenariosPage";
import * as automationsApi from "@/features/automations/api";
import * as teamApi from "@/features/team/api";
import type { AutomationScenario } from "@/features/automations/types";

vi.mock("@/features/automations/api");
vi.mock("@/features/team/api");

const scenario: AutomationScenario = {
  id: "scenario-1",
  name: "Accueil",
  position: 0,
  status: "draft",
  status_label: "Brouillon",
  trigger_type: "conversation_opened",
  trigger_type_label: "Conversation ouverte",
  conditions: [],
  steps: [{ type: "send_message", config: { body: "Bonjour !" } }],
};

describe("AutomationScenariosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teamApi.listMembers).mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 },
    });
  });

  it("liste les scenarios existants", async () => {
    vi.mocked(automationsApi.listAutomations).mockResolvedValue({ data: [scenario] });

    render(<AutomationScenariosPage />);

    expect(await screen.findByText("Accueil", { exact: false })).toBeInTheDocument();
  });

  it("cree un nouveau scenario", async () => {
    vi.mocked(automationsApi.listAutomations).mockResolvedValue({ data: [] });
    vi.mocked(automationsApi.createAutomation).mockResolvedValue({ data: { ...scenario, id: "scenario-2", name: "Bienvenue" } });
    const user = userEvent.setup();

    render(<AutomationScenariosPage />);
    await screen.findByText("Aucun scénario");

    await user.type(screen.getByLabelText("Nom du scénario"), "Bienvenue");
    await user.click(screen.getByRole("button", { name: "Créer le scénario" }));

    await waitFor(() => expect(screen.getByText("Bienvenue", { exact: false })).toBeInTheDocument());
    expect(automationsApi.createAutomation).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Bienvenue", trigger_type: "conversation_opened" }),
    );
  });

  it("teste un scenario et affiche le resultat", async () => {
    vi.mocked(automationsApi.listAutomations).mockResolvedValue({ data: [scenario] });
    vi.mocked(automationsApi.testAutomation).mockResolvedValue({
      data: { conditions_matched: true, steps: [{ type: "send_message", preview: "Envoie : « Bonjour ! »" }] },
    });
    const user = userEvent.setup();

    render(<AutomationScenariosPage />);
    await screen.findByText("Accueil", { exact: false });

    await user.click(screen.getByRole("button", { name: "Tester" }));
    await user.type(screen.getByLabelText("Message du visiteur"), "Bonjour.");
    await user.click(screen.getByRole("button", { name: "Tester" }));

    expect(await screen.findByText("Les critères correspondent.")).toBeInTheDocument();
    expect(screen.getByText("Envoie : « Bonjour ! »")).toBeInTheDocument();
  });

  it("supprime un scenario", async () => {
    vi.mocked(automationsApi.listAutomations).mockResolvedValue({ data: [scenario] });
    vi.mocked(automationsApi.deleteAutomation).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AutomationScenariosPage />);
    await screen.findByText("Accueil", { exact: false });

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.queryByText("Accueil", { exact: false })).not.toBeInTheDocument());
  });
});
