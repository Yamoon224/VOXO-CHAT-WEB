import { ContactSegmentsPage } from "@/features/contacts/components/ContactSegmentsPage";

export default function ContactSegmentsRoutePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Segments</h1>
      <ContactSegmentsPage />
    </div>
  );
}
