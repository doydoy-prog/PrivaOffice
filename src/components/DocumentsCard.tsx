import type { Document, DocStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  documents: Document[];
}

const statusLabels: Record<DocStatus, { label: string; style: string }> = {
  draft_ai: { label: "טיוטת AI", style: "bg-bg text-text-muted border-border" },
  under_review: { label: "בבדיקת DPO", style: "bg-[#F5E8C4] text-gold-dark border-gold/40" },
  needs_edit: { label: "דורש עריכה", style: "bg-warning-bg text-warning border-warning/30" },
  approved: { label: "מאושר", style: "bg-success-bg text-success border-success/30" },
  published: { label: "פורסם", style: "bg-success-bg text-success border-success/40" },
};

const typeLabels: Record<string, string> = {
  db_definition: "הגדרות מאגר",
  privacy_policy: "מדיניות פרטיות",
  consent_text: "טקסט הסכמה",
  dpa: "הסכם DPA",
  data_minimization: "צמצום מידע",
  security_procedure: "נוהל אבטחה",
  dsr_procedure: "נוהל DSR",
  other: "אחר",
};

export function DocumentsCard({ documents }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-bg-card p-6 shadow-soft">
      <header className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          מסמכים
        </h3>
        <span className="text-xs text-text-muted">{documents.length} פעילים</span>
      </header>

      <ul className="flex flex-col gap-2.5">
        {documents.map((d) => {
          const status = statusLabels[d.status];
          return (
            <li
              key={d.id}
              className="rounded-xl border border-border bg-bg p-3 transition-colors hover:border-gold"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-navy/8 px-2 py-0.5 text-[10px] font-semibold text-navy">
                      {typeLabels[d.type] || d.type}
                    </span>
                    <span className="text-[11px] text-text-soft">v{d.version}</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-navy">{d.title}</h4>
                  <div className="mt-1 text-[11px] text-text-muted">
                    נוצר {formatDate(d.generatedAt)}
                    {d.approvedAt && ` · אושר ${formatDate(d.approvedAt)}`}
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${status.style}`}
                >
                  {status.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
