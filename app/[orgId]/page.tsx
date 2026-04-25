import { notFound } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { getOrganizationDashboard } from "@/lib/actions/organizations";

export const dynamic = "force-dynamic";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = await getOrganizationDashboard(orgId);
  if (!org) notFound();
  return <Dashboard org={org} />;
}
