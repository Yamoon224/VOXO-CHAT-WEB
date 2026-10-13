import type { Metadata } from "next";
import { listPublicPlans } from "@/features/marketing/api";
import { PricingTable } from "@/features/marketing/components/PricingTable";

export const metadata: Metadata = {
  title: "Tarifs — VOXO",
  description: "Un palier gratuit, des paliers payants par sièges, contacts et crédits IA, une offre sur devis.",
};

export default async function TarifsRoutePage() {
  const { data: plans } = await listPublicPlans();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Tarifs</h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted">
          Essai gratuit de toutes les fonctions, sans carte bancaire. Les crédits IA et les plafonds de
          sièges, contacts et documents sont appliqués côté serveur — vous êtes alerté avant d&apos;atteindre
          un plafond, jamais coupé sans prévenir.
        </p>
      </header>

      <PricingTable plans={plans} />
    </div>
  );
}
