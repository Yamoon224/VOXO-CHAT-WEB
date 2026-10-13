const SECTIONS = [
  {
    title: "Éditeur du site",
    body: "VOXO SAS — [raison sociale, SIRET et adresse de siège à compléter avant publication]. Directeur de la publication : [nom à compléter].",
  },
  {
    title: "Hébergement",
    body: "[Nom et adresse de l'hébergeur à compléter avant publication].",
  },
  {
    title: "Propriété intellectuelle",
    body: "L'ensemble des éléments de ce site (textes, visuels, marque VOXO) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.",
  },
  {
    title: "Données personnelles",
    body: "Les données collectées via ce site et l'application (compte, messages, visiteurs du widget) sont traitées conformément au RGPD. [Politique de confidentialité détaillée et coordonnées du délégué à la protection des données à compléter avant publication].",
  },
  {
    title: "Cookies",
    body: "Le site et l'application utilisent des cookies strictement nécessaires à l'authentification. Aucun cookie publicitaire ou de mesure d'audience tiers n'est déposé sans consentement.",
  },
  {
    title: "Contact",
    body: "Pour toute question relative à ces mentions, écrivez à contact@voxo.chat.",
  },
];

/**
 * Contenu provisoire : les mentions portant `[à compléter]` doivent être
 * finalisées avec un conseil juridique avant toute mise en production.
 */
export function LegalPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Mentions légales</h1>
        <p className="rounded-md border border-border-strong bg-surface px-4 py-3 text-sm text-muted">
          Page provisoire : les informations marquées « à compléter » doivent être vérifiées avec un
          conseil juridique avant la mise en ligne publique du site.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
            <p className="leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
