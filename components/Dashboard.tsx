import Link from "next/link";
import ScoreRing from "@/components/ScoreRing";
import TaskGrid from "@/components/TaskGrid";
import { OrganizationDashboard } from "@/lib/actions/organizations";
import { TASKS } from "@/lib/tasks";
import { securityLevelLabel } from "@/lib/security";

export default function Dashboard({ org }: { org: OrganizationDashboard }) {
  const total = TASKS.length;
  const done = Object.values(org.taskStatuses).filter((s) => s === "done").length;
  const score = total ? Math.round((done / total) * 100) : 0;
  const db = org.dataAsset;
  const hasDb = !!db && db.dataTypes.length > 0;

  return (
    <div
      className="mx-auto max-w-[1200px] px-10 pt-8 pb-16"
      style={{ paddingInline: "clamp(16px, 4vw, 40px)" }}
    >
      <div
        className="relative mb-7 overflow-hidden rounded-[18px] px-9 py-8 text-white"
        style={{
          background:
            "linear-gradient(135deg,var(--color-navy),var(--color-navy-light))",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "-40%",
            left: "-15%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle,rgba(212,169,74,.2),transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="mb-1 text-[24px] font-extrabold">{org.name}</h1>
            <p
              className="max-w-[500px] text-[14px] leading-relaxed"
              style={{ color: "rgba(255,255,255,.7)" }}
            >
              {hasDb
                ? `מאגר "${db!.name}" · רמה ${securityLevelLabel(
                    (db!.securityLevel || "basic") as "basic" | "medium" | "high",
                  )} · ${db!.subjectsCount.toLocaleString("he-IL")} נושאי מידע`
                : "טרם הוגדר מאגר מידע - התחל ממסמך הגדרות מאגר"}
            </p>
          </div>
          <ScoreRing percent={score} />
        </div>
      </div>

      {hasDb ? (
        <>
          <div
            className="mb-7 grid gap-3.5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
          >
            <StatCard
              label="נושאי מידע"
              value={db!.subjectsCount.toLocaleString("he-IL")}
            />
            <StatCard
              label="ספקים"
              value={String(db!.vendors.length)}
              sub={db!.vendors.map((v) => v.name).filter(Boolean).join(", ") || "—"}
            />
            <StatCard label="משימות פתוחות" value={String(total - done)} />
            <StatCard
              label="רמת אבטחה"
              value={securityLevelLabel(
                (db!.securityLevel || "basic") as "basic" | "medium" | "high",
              )}
              valueStyle={{ color: "var(--color-gold-deep)" }}
            />
          </div>
          <div className="mb-5 flex gap-2.5">
            <Link
              href={`/${org.id}/data-asset`}
              className="btn btn-ghost btn-sm"
            >
              ✏️ ערוך פרטי מאגר
            </Link>
            <Link href={`/${org.id}/dpo-zone`} className="btn btn-ghost btn-sm">
              📋 שגרת DPO
            </Link>
          </div>
        </>
      ) : (
        <EmptyDataAssetCta orgId={org.id} />
      )}

      <div className="mb-5 flex items-center justify-between">
        <h2
          className="text-[18px] font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          משימות הסדרה
        </h2>
        <span
          className="rounded-xl px-3 py-1 text-[12px] font-semibold"
          style={{
            background: "var(--color-navy)",
            color: "var(--color-gold)",
          }}
        >
          {done}/{total}
        </span>
      </div>
      <TaskGrid orgId={org.id} statuses={org.taskStatuses} />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueStyle,
}: {
  label: string;
  value: string;
  sub?: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={valueStyle}>
        {value}
      </div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function EmptyDataAssetCta({ orgId }: { orgId: string }) {
  return (
    <div className="card mb-7" style={{ padding: 40, textAlign: "center" }}>
      <div className="mb-3 text-[40px]">📋</div>
      <h2
        className="mb-2 text-[20px] font-bold"
        style={{ color: "var(--color-navy)" }}
      >
        הגדר את מאגר המידע הראשון
      </h2>
      <p
        className="mb-4 text-[14px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        כדי להתחיל בתהליך ההסדרה, יש להגדיר קודם את פרטי מאגר המידע של הארגון.
      </p>
      <Link
        href={`/${orgId}/data-asset`}
        className="btn btn-primary"
        style={{ fontSize: 16 }}
      >
        התחל הגדרת מאגר
      </Link>
    </div>
  );
}
