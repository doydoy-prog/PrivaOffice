import Link from "next/link";
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gradient-to-r from-[#fbf7ec] to-[#f5ecd6] p-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
            התחל תהליך חדש
          </div>
          <div className="mt-1 text-[15px] font-semibold text-navy">
            הוסף מאגר מידע חדש ויצר מסמך הגדרות + תוכנית עבודה אוטומטית
          </div>
          <p className="mt-0.5 text-xs text-text-muted">
            שאלון אינטראקטיבי בן 11 שלבים עם חישוב רמת אבטחה, יצירת משימות ויצוא מסמך.
          </p>
        </div>
        <Link
          href="/data-assets/new"
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-bold text-gold transition-all hover:-translate-y-px hover:bg-navy-light"
        >
          התחל שאלון מאגר חדש
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

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
        DataBee · Phase 2 · Wizard + Security Engine + Task Generator
      </footer>
    </div>
  );
}
