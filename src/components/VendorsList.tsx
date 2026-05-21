import type { Vendor } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  vendors: Vendor[];
}

const riskStyles: Record<Vendor["riskLevel"], string> = {
  low: "bg-success-bg text-success",
  medium: "bg-warning-bg text-warning",
  high: "bg-danger-bg text-danger",
};

const riskLabels: Record<Vendor["riskLevel"], string> = {
  low: "סיכון נמוך",
  medium: "סיכון בינוני",
  high: "סיכון גבוה",
};

export function VendorsList({ vendors }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-bg-card p-6 shadow-soft">
      <header className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          ספקים חיצוניים
        </h3>
        <span className="text-xs text-text-muted">
          {vendors.filter((v) => v.hasDPA).length}/{vendors.length} חתומים על DPA
        </span>
      </header>

      <ul className="flex flex-col gap-2.5">
        {vendors.map((v) => (
          <li
            key={v.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg p-3 transition-colors hover:border-gold"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-navy">{v.name}</h4>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${riskStyles[v.riskLevel]}`}>
                  {riskLabels[v.riskLevel]}
                </span>
                {v.hasStandardDPA && (
                  <span className="rounded-md bg-navy/10 px-2 py-0.5 text-[10px] font-medium text-navy">
                    DPA סטנדרטי
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-text-muted">
                <span>{v.activity}</span>
                <span>· מיקום: {v.location}</span>
                {v.dpaExpiresAt && <span>· תפוגה: {formatDate(v.dpaExpiresAt)}</span>}
              </div>
            </div>

            <div className="flex-shrink-0">
              {v.hasDPA ? (
                <span className="flex items-center gap-1 rounded-md bg-success-bg px-2 py-1 text-[11px] font-semibold text-success">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  חתום
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-md bg-danger-bg px-2 py-1 text-[11px] font-semibold text-danger">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  חסר
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
