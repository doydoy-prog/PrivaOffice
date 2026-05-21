import { Wizard } from "@/components/wizard/Wizard";
import { mockOrg } from "@/lib/mock-data";

export default function NewDataAssetPage() {
  return <Wizard orgName={mockOrg.name} />;
}
