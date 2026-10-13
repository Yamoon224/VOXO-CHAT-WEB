const SECTIONS = [
  {
    title: "Agent IA",
    body: "Répond à partir de vos sources avec citations vérifiables, ton et consignes réglables par espace de travail, bac à sable pour tester avant d'activer. Seuil de confiance réglable : sous ce seuil, la conversation passe à un agent avec le contexte complet, pas juste le dernier message.",
  },
  {
    title: "Widget de chat",
    body: "Un script à copier-coller, personnalisable en couleurs, logo, position et message d'accueil. Horaires d'ouverture avec message hors horaires, pièces jointes, évaluation de la conversation à la clôture.",
  },
  {
    title: "Boîte de réception partagée",
    body: "Toutes les conversations dans une vue unique, filtrables et recherchables. Affectation à un agent, statuts ouverte / en attente / résolue, notes internes invisibles du visiteur, réponses pré-enregistrées pour les questions répétées.",
  },
  {
    title: "Base de connaissances",
    body: "Indexation de pages web, fichiers importés et entrées question/réponse. Recherche sémantique : l'agent retrouve le passage pertinent, pas seulement le document entier.",
  },
  {
    title: "Analytics",
    body: "Nombre de conversations et de messages, taux de satisfaction, part des conversations résolues par l'IA, escaladées ou restées sans réponse — calculés en base, pas estimés.",
  },
  {
    title: "Offre, facturation et quotas",
    body: "Essai gratuit de toutes les fonctions, sans carte bancaire. Crédits IA inclus par palier, décomptés par conversation automatisée. Quotas de places, de contacts et de documents appliqués côté serveur, avec une alerte avant le plafond plutôt qu'un blocage surprise.",
  },
];

export function FeaturesPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-16 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Fonctionnalités</h1>
        <p className="text-lg leading-relaxed text-muted">
          Ce que fait VOXO aujourd&apos;hui, dans l&apos;ordre où une équipe de support le rencontre : de
          la base de connaissances à la conversation qui atterrit dans la boîte partagée.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-2 border-t border-border pt-8 first:border-t-0 first:pt-0">
            <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            <p className="leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
