import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WebsiteSourceForm } from "@/features/knowledge/components/WebsiteSourceForm";
import { ApiError } from "@/lib/api/errors";

describe("WebsiteSourceForm", () => {
  it("cree une source web avec la cadence choisie", async () => {
    const create = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<WebsiteSourceForm create={create} />);

    await user.type(screen.getByLabelText("URL du site"), "https://exemple.test");
    await user.selectOptions(screen.getByLabelText("Ré-indexation planifiée"), "daily");
    await user.click(screen.getByRole("button", { name: "Explorer le site" }));

    expect(create).toHaveBeenCalledWith({
      name: undefined,
      url: "https://exemple.test",
      sitemapUrl: undefined,
      recrawlFrequency: "daily",
    });
  });

  it("affiche l'erreur de configuration renvoyée par le serveur", async () => {
    const create = vi
      .fn()
      .mockRejectedValue(new ApiError(422, "L'exploration exige une URL de départ.", "website_source_configuration_invalid"));
    const user = userEvent.setup();

    render(<WebsiteSourceForm create={create} />);

    await user.type(screen.getByLabelText("URL du site"), "https://exemple.test");
    await user.click(screen.getByRole("button", { name: "Explorer le site" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("URL de départ");
  });
});
