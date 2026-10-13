import type { Metadata } from "next";
import { FeaturesPage } from "@/features/marketing/components/FeaturesPage";

export const metadata: Metadata = {
  title: "Fonctionnalités — VOXO",
  description: "Agent IA, widget, boîte de réception partagée, base de connaissances et analytics.",
};

export default function FonctionnalitesRoutePage() {
  return <FeaturesPage />;
}
