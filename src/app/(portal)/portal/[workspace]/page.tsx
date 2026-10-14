import { PortalHomePage } from "@/features/portal/components/PortalHomePage";

export default async function PortalPage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params;

  return <PortalHomePage workspaceId={workspace} />;
}
