import { ContactDetailPage } from "@/features/contacts/components/ContactDetailPage";

export default async function ContactRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Contact</h1>
      <ContactDetailPage contactId={id} />
    </div>
  );
}
