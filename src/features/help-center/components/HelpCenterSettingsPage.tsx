"use client";

import { Card } from "@/components/ui";
import { HelpCenterCategoriesSection } from "@/features/help-center/components/HelpCenterCategoriesSection";
import { HelpCenterArticlesSection } from "@/features/help-center/components/HelpCenterArticlesSection";

/** Écran `/settings/help-center` : catégories et articles du centre d'aide public. */
export function HelpCenterSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Catégories</h2>
        <HelpCenterCategoriesSection />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Articles</h2>
        <HelpCenterArticlesSection />
      </Card>
    </div>
  );
}
