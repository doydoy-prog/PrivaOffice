import { ComplianceScore } from "@/components/ComplianceScore";
import { DataAssetsList } from "@/components/DataAssetsList";
import { DocumentsCard } from "@/components/DocumentsCard";
import { TaskList } from "@/components/TaskList";
import { VendorsList } from "@/components/VendorsList";
import {
  computeSnapshot,
  mockDataAssets,
  mockDocuments,
  mockOrg,
  mockTasks,
  mockVendors,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const snapshot = computeSnapshot(mockTasks, mockDocuments);

  return (
    <div className="flex flex-col gap-6">
      <ComplianceScore snapshot={snapshot} orgName={mockOrg.name} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-6">
          <TaskList tasks={mockTasks} />
        </div>

        <aside className="flex flex-col gap-6">
          <DataAssetsList assets={mockDataAssets} />
          <VendorsList vendors={mockVendors} />
          <DocumentsCard documents={mockDocuments} />
        </aside>
      </div>

      <footer className="pt-4 text-center text-[11px] text-text-soft">
        DataBee · Phase 1 · MVP with mock data ·{" "}
        <span className="font-mono">/home/user/PrivaOffice</span>
      </footer>
    </div>
  );
}
