import { HelpCenterHomePage } from "@/features/help-center-public/components/HelpCenterHomePage";

export default async function HelpCenterWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { workspace } = await params;
  const { category } = await searchParams;

  return <HelpCenterHomePage workspaceId={workspace} categoryId={category} />;
}
