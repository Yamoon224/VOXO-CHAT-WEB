import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadSourceForm } from "@/features/knowledge/components/UploadSourceForm";

describe("UploadSourceForm", () => {
  it("importe les fichiers choisis puis vide le formulaire", async () => {
    const upload = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    const file = new File(["contenu"], "guide.txt", { type: "text/plain" });

    render(<UploadSourceForm upload={upload} />);

    await user.type(screen.getByLabelText("Nom de la source"), "Documentation");
    await user.upload(screen.getByLabelText("Fichiers"), file);
    await user.click(screen.getByRole("button", { name: "Importer" }));

    expect(upload).toHaveBeenCalledWith("Documentation", [file]);
    expect(await screen.findByLabelText("Nom de la source")).toHaveValue("");
  });

  it("refuse l'envoi sans fichier choisi", async () => {
    const upload = vi.fn();
    const user = userEvent.setup();

    render(<UploadSourceForm upload={upload} />);

    await user.click(screen.getByRole("button", { name: "Importer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("au moins un fichier");
    expect(upload).not.toHaveBeenCalled();
  });
});
