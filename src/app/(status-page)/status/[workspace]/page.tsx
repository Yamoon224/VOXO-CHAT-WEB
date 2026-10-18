import { PublicStatusPage } from "@/features/status-page-public/components/PublicStatusPage";

export default async function StatusWorkspacePage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params;

  return <PublicStatusPage workspaceId={workspace} />;
}
