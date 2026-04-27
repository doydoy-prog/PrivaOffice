import type { ComplianceSnapshot } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  snapshot: ComplianceSnapshot;
  orgName: string;
}

function scoreMessage(score: number): string {
  if (score >= 90) return "רמת עמידה מצוינת";
  if (score >= 75) return "רמה גבוהה - עוד כמה שיפורים";
  if (score >= 50) return "באמצע הדרך - המשיכו";
  if (score >= 25) return "התחלתם - יש עוד עבודה";
  return "בתחילת התהליך";
}

export function ComplianceScore({ snapshot, orgName }: Props) {
  const { score } = snapshot;
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-light p-8 text-white shadow-lg">
      <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center justify-center">
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 140 140" className="-rotate-90">
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="10"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="#D4A94A"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-white/60">מתוך 100</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gold">
            רמת עמידה בחוק
          </div>
          <h2 className="mt-1 text-2xl font-bold">{orgName}</h2>
          <p className="mt-1 text-sm text-white/70">{scoreMessage(score)}</p>

          <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">
            <Stat label="משימות הושלמו" value={`${snapshot.completedTasks}/${snapshot.totalTasks}`} />
            <Stat label="מסמכים מאושרים" value={snapshot.approvedDocs} />
            <Stat label="בבדיקת DPO" value={snapshot.pendingDpoReview} accent={snapshot.pendingDpoReview > 0} />
            <Stat label="משימות קריטיות פתוחות" value={snapshot.highPriorityOpen} danger={snapshot.highPriorityOpen > 0} />
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/60">יעד קרוב</div>
            <div className="mt-1 text-lg font-semibold text-gold">
              {snapshot.nextDueDate ? formatDate(snapshot.nextDueDate) : "—"}
            </div>
            <div className="mt-1 text-xs text-white/55">
              {snapshot.highPriorityOpen} משימות בעדיפות גבוהה
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
  danger,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-white/55">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl font-bold ${
          danger ? "text-[#F5A8A8]" : accent ? "text-gold" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
