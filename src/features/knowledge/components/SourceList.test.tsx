import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SourceList } from "@/features/knowledge/components/SourceList";
import type { KnowledgeSource } from "@/features/knowledge/types";

const websiteSource: KnowledgeSource = {
  id: "src-1",
  type: "website",
  type_label: "Site web exploré",
  name: "Exemple",
  website_url: "https://exemple.test",
  website_sitemap_url: null,
  recrawl_frequency: "daily",
  last_crawled_at: null,
  created_at: "2026-10-08T00:00:00Z",
};

describe("SourceList", () => {
  it("propose ré-explorer et supprimer pour une source web quand l'appelant gère la base", async () => {
    const onDelete = vi.fn();
    const onRecrawl = vi.fn();
    const user = userEvent.setup();

    render(<SourceList sources={[websiteSource]} canManage onDelete={onDelete} onRecrawl={onRecrawl} />);

    await user.click(screen.getByRole("button", { name: "Ré-explorer" }));
    expect(onRecrawl).toHaveBeenCalledWith("src-1");

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(onDelete).toHaveBeenCalledWith("src-1");
  });

  it("ne propose aucune action sans la permission de gestion", () => {
    render(<SourceList sources={[websiteSource]} canManage={false} onDelete={vi.fn()} onRecrawl={vi.fn()} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
