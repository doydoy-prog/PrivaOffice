import ClientListView from "@/components/ClientListView";
import { listOrganizations } from "@/lib/actions/organizations";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const organizations = await listOrganizations();
  return <ClientListView organizations={organizations} />;
}
