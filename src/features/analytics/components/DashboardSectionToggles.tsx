import { Card } from "@/components/ui";
import { DASHBOARD_SECTIONS, type DashboardSectionKey } from "@/features/analytics/components/useDashboardSections";

/** Personnalisation du tableau de bord (section 2.12) : chaque carte peut être masquée. */
export function DashboardSectionToggles({
  isVisible,
  toggle,
}: {
  isVisible: (key: DashboardSectionKey) => boolean;
  toggle: (key: DashboardSectionKey) => void;
}) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-foreground">Cartes affichées</h2>
      <div className="flex flex-wrap gap-4">
        {DASHBOARD_SECTIONS.map((section) => (
          <label key={section.key} className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={isVisible(section.key)} onChange={() => toggle(section.key)} />
            {section.label}
          </label>
        ))}
      </div>
    </Card>
  );
}
