import { BillingPage } from "@/features/billing/components/BillingPage";

export default function SettingsBillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Facturation</h1>
      <BillingPage />
    </div>
  );
}
