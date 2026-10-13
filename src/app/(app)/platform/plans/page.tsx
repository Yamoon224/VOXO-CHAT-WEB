import { PlatformPlansPage } from "@/features/platform/components/PlatformPlansPage";

export default function PlatformPlansRoutePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Paliers tarifaires</h1>
      <PlatformPlansPage />
    </div>
  );
}
