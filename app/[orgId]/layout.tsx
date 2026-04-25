import { notFound } from "next/navigation";
import OrgHeader from "@/components/OrgHeader";
import { prisma } from "@/lib/prisma";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true, name: true },
  });
  if (!org) notFound();

  return (
    <>
      <OrgHeader orgId={org.id} orgName={org.name} activeTab="dashboard" />
      {children}
    </>
  );
}
