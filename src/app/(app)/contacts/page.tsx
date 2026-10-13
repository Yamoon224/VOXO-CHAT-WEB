import { ContactsPage } from "@/features/contacts/components/ContactsPage";

export default function ContactsRoutePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Contacts</h1>
      <ContactsPage />
    </div>
  );
}
