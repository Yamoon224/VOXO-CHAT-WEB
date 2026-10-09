import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangeForm } from "@/features/analytics/components/DateRangeForm";

describe("DateRangeForm", () => {
  it("applique la période saisie", async () => {
    const onApply = vi.fn();
    const user = userEvent.setup();

    render(<DateRangeForm from="" to="" onApply={onApply} />);

    await user.type(screen.getByLabelText("Du"), "2026-09-01");
    await user.type(screen.getByLabelText("Au"), "2026-10-01");
    await user.click(screen.getByRole("button", { name: "Appliquer" }));

    expect(onApply).toHaveBeenCalledWith("2026-09-01", "2026-10-01");
  });
});
