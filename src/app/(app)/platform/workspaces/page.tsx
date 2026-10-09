import { PlatformWorkspacesPage } from "@/features/platform/components/PlatformWorkspacesPage";

export default function PlatformWorkspacesRoutePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Espaces de travail</h1>
      <PlatformWorkspacesPage />
    </div>
  );
}
