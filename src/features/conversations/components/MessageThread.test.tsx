import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageThread } from "@/features/conversations/components/MessageThread";
import type { Message } from "@/features/conversations/types";

describe("MessageThread", () => {
  it("affiche les messages et distingue les notes internes", () => {
    const messages: Message[] = [
      {
        id: "m-1",
        sender_type: "visitor",
        sender_label: "Visiteur",
        sender_user: null,
        visibility: "public",
        body: "Bonjour !",
        citations: [],
        attachment_filename: null,
        created_at: "2026-10-09T00:00:00Z",
      },
      {
        id: "m-2",
        sender_type: "agent",
        sender_label: "Agent",
        sender_user: { id: "u-1", name: "Awa" },
        visibility: "internal",
        body: "Client prioritaire.",
        citations: [],
        attachment_filename: null,
        created_at: "2026-10-09T00:01:00Z",
      },
    ];

    render(<MessageThread messages={messages} />);

    expect(screen.getByText("Bonjour !")).toBeInTheDocument();
    expect(screen.getByText("Client prioritaire.")).toBeInTheDocument();
    expect(screen.getByText("Note interne")).toBeInTheDocument();
    expect(screen.getByText("Awa")).toBeInTheDocument();
  });

  it("affiche les citations de l'agent IA", () => {
    const messages: Message[] = [
      {
        id: "m-1",
        sender_type: "ai",
        sender_label: "Agent IA",
        sender_user: null,
        visibility: "public",
        body: "Nous sommes ouverts de 9h à 18h.",
        citations: [{ title: "Horaires", content: "9h-18h", citation_url: null }],
        attachment_filename: null,
        created_at: "2026-10-09T00:00:00Z",
      },
    ];

    render(<MessageThread messages={messages} />);

    expect(screen.getByText("Horaires")).toBeInTheDocument();
  });
});
