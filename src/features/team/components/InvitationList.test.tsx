import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvitationList } from "@/features/team/components/InvitationList";
import type { Invitation } from "@/features/team/types";

const invitation: Invitation = {
  id: "inv-1",
  email: "nouveau@example.test",
  role: "agent",
  role_label: "Agent",
  invited_by: "Awa",
  expires_at: "2026-10-14T00:00:00Z",
  created_at: "2026-10-07T00:00:00Z",
};

describe("InvitationList", () => {
  it("révoque une invitation", async () => {
    const onRevoke = vi.fn();
    const user = userEvent.setup();

    render(<InvitationList invitations={[invitation]} onRevoke={onRevoke} />);

    expect(screen.getByText("nouveau@example.test")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Révoquer" }));

    expect(onRevoke).toHaveBeenCalledWith("inv-1");
  });
});
