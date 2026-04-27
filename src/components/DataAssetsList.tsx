import type { DataAsset, SecurityLevel } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface Props {
  assets: DataAsset[];
}

const securityLabels: Record<SecurityLevel, { label: string; style: string }> = {
  basic: { label: "בסיסית", style: "bg-success-bg text-success" },
  medium: { label: "בינונית", style: "bg-warning-bg text-warning" },
  high: { label: "גבוהה", style: "bg-danger-bg text-danger" },
};

export function DataAssetsList({ assets }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-bg-card p-6 shadow-soft">
      <header className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </span>
          מאגרי מידע
        </h3>
        <span className="text-xs text-text-muted">{assets.length} מאגרים פעילים</span>
      </header>

      <ul className="flex flex-col gap-3">
        {assets.map((a) => {
          const sec = securityLabels[a.securityLevel];
          return (
            <li
              key={a.id}
              className="rounded-xl border border-border bg-bg p-4 transition-colors hover:border-gold"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-navy md:text-base">{a.name}</h4>
                  <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
                    {a.purpose}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${sec.style}`}
                >
                  רמה {sec.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
                <Metric label="נושאי מידע" value={formatNumber(a.subjectsCount)} />
                <Metric label="מורשי גישה" value={a.permissionsCount} />
                <Metric
                  label="מידע רגיש"
                  value={a.hasSensitiveData ? `${a.sensitiveTypes.length} סוגים` : "אין"}
                  accent={a.hasSensitiveData}
                />
                <Metric
                  label="העברה לחו״ל"
                  value={a.transferAbroad ? "כן" : "לא"}
                  accent={a.transferAbroad}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div
        className={`mt-0.5 font-semibold ${accent ? "text-gold-dark" : "text-navy"}`}
      >
        {value}
      </div>
    </div>
  );
}
