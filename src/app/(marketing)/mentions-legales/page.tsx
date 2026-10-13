import type { Metadata } from "next";
import { LegalPage } from "@/features/marketing/components/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales — VOXO",
};

export default function MentionsLegalesRoutePage() {
  return <LegalPage />;
}
