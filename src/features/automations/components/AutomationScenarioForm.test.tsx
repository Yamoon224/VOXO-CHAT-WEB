import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AutomationScenarioForm } from "@/features/automations/components/AutomationScenarioForm";
import type { Member } from "@/features/team/types";

const members: Member[] = [
  { id: "member-1", role: "agent", role_label: "Agent", joined_at: "2026-10-09T00:00:00Z", user: { id: "user-1", name: "Awa", email: "awa@exemple.fr", last_login_at: null } },
];

describe("AutomationScenarioForm", () => {
  it("envoie une etape poser une question avec son attribut", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AutomationScenarioForm members={members} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nom du scénario"), "Capture e-mail");
    await user.click(screen.getByRole("button", { name: "Ajouter une étape" }));
    await user.selectOptions(screen.getByLabelText("Action"), "ask_question");
    await user.type(screen.getByLabelText("Question"), "Votre e-mail ?");
    await user.type(screen.getByLabelText("Attribut du contact à renseigner"), "email");
    await user.click(screen.getByRole("button", { name: "Créer le scénario" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Capture e-mail",
        steps: [{ type: "ask_question", config: { body: "Votre e-mail ?", attribute_key: "email" } }],
      }),
    );
  });

  it("envoie une etape affecter a un agent choisi dans la liste", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AutomationScenarioForm members={members} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nom du scénario"), "Escalade");
    await user.click(screen.getByRole("button", { name: "Ajouter une étape" }));
    await user.selectOptions(screen.getByLabelText("Action"), "assign_user");
    await user.selectOptions(screen.getByLabelText("Agent"), "user-1");
    await user.click(screen.getByRole("button", { name: "Créer le scénario" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ steps: [{ type: "assign_user", config: { user_id: "user-1" } }] }),
    );
  });

  it("deplace une etape vers le bas", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AutomationScenarioForm members={members} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nom du scénario"), "Ordre");
    await user.click(screen.getByRole("button", { name: "Ajouter une étape" }));
    await user.type(screen.getByLabelText("Message"), "Premier");
    await user.click(screen.getByRole("button", { name: "Ajouter une étape" }));

    const messageFields = screen.getAllByLabelText("Message");
    await user.type(messageFields[1], "Second");
    await user.click(screen.getAllByRole("button", { name: "↓" })[0]);
    await user.click(screen.getByRole("button", { name: "Créer le scénario" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        steps: [
          { type: "send_message", config: { body: "Second" } },
          { type: "send_message", config: { body: "Premier" } },
        ],
      }),
    );
  });
});
