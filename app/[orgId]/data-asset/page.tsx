import { notFound } from "next/navigation";
import DataAssetForm from "@/components/DataAssetForm";
import { prisma } from "@/lib/prisma";
import { getDataAssetState } from "@/lib/actions/data-asset";

export const dynamic = "force-dynamic";

export default async function DataAssetPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true },
  });
  if (!org) notFound();

  const initial = await getDataAssetState(org.id);
  return <DataAssetForm orgId={org.id} initial={initial} />;
}
