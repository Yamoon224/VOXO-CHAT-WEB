import Link from "next/link";
import { ConversationPreview } from "@/features/marketing/components/ConversationPreview";

const STEPS = [
  {
    title: "Connectez vos sources",
    body: "Importez vos pages, PDF et FAQ ; VOXO les découpe et les indexe automatiquement.",
  },
  {
    title: "L'agent répond avec citations",
    body: "Chaque réponse pointe vers le document qui la justifie — jamais une réponse sans source.",
  },
  {
    title: "L'humain reprend le relais",
    body: "Sous le seuil de confiance que vous réglez, la conversation bascule dans la boîte partagée, contexte inclus.",
  },
];

const CAPABILITIES = [
  {
    title: "Agent IA et base de connaissances",
    body: "Ton et consignes réglables par espace de travail, bac à sable pour tester avant publication, résumé et analyse de sentiment sur chaque conversation.",
  },
  {
    title: "Boîte de réception partagée",
    body: "Affectation, statuts, notes internes et réponses pré-enregistrées : tous les canaux dans une seule file, pas une par outil.",
  },
  {
    title: "Offre et quotas maîtrisés",
    body: "Crédits IA inclus par palier, essai gratuit sans carte bancaire, alerte avant d'atteindre un plafond plutôt qu'une coupure surprise.",
  },
];

export function HomePage() {
  return (
    <div className="flex flex-col gap-24 px-6 py-16 sm:py-24">
      <section className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[3fr_2fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            L&apos;IA répond avec vos sources. Votre équipe reprend quand il faut un humain.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            VOXO indexe votre documentation, répond aux visiteurs avec des citations vérifiables, et
            bascule la conversation à un agent dès que la confiance baisse — sans jamais perdre le
            contexte.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              Essayer gratuitement
            </Link>
            <Link href="/tarifs" className="text-sm font-medium text-foreground hover:text-primary">
              Voir les tarifs
            </Link>
          </div>
        </div>

        <ConversationPreview />
      </section>

      <section className="mx-auto w-full max-w-5xl">
        <ol className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-primary">{index + 1}</span>
              <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        {CAPABILITIES.map((capability, index) => (
          <div
            key={capability.title}
            className={`grid gap-6 border-t border-border pt-8 sm:grid-cols-[1fr_2fr] ${index === 0 ? "border-t-0 pt-0" : ""}`}
          >
            <h3 className="text-lg font-semibold text-foreground">{capability.title}</h3>
            <p className="max-w-xl text-sm leading-relaxed text-muted">{capability.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 rounded-lg border border-border bg-surface p-10">
        <h2 className="text-2xl font-semibold text-foreground">Prêt à indexer votre première source ?</h2>
        <p className="max-w-md text-sm text-muted">
          Aucune carte bancaire requise pour démarrer : créez un espace de travail et testez l&apos;agent
          sur vos propres contenus.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
        >
          Essayer gratuitement
        </Link>
      </section>
    </div>
  );
}
