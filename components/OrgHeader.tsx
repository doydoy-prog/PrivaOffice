import Link from "next/link";

export default function OrgHeader({
  orgId,
  orgName,
  activeTab,
}: {
  orgId: string;
  orgName: string;
  activeTab?: "dashboard" | "dpo-zone";
}) {
  const initial = orgName.trim().charAt(0) || "?";
  return (
    <div
      className="sticky z-40 flex items-center gap-4 border-b px-7 py-2"
      style={{
        top: 56,
        background: "rgba(10,31,61,.96)",
        borderColor: "rgba(255,255,255,.06)",
        color: "#fff",
      }}
    >
      <Link
        href="/"
        className="text-[12px] font-medium"
        style={{ color: "rgba(255,255,255,.55)" }}
      >
        ← כל הלקוחות
      </Link>

      <div className="flex items-center gap-2.5">
        <span className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>
          {initial}
        </span>
        <span className="text-[14px] font-bold">{orgName}</span>
      </div>

      <nav className="mr-auto flex gap-1.5">
        <Link
          href={`/${orgId}`}
          className={navClass(activeTab === "dashboard")}
          style={navStyle(activeTab === "dashboard")}
        >
          דשבורד
        </Link>
        <Link
          href={`/${orgId}/dpo-zone`}
          className={navClass(activeTab === "dpo-zone")}
          style={navStyle(activeTab === "dpo-zone")}
        >
          שגרת DPO
        </Link>
      </nav>
    </div>
  );
}

function navClass(_active: boolean) {
  return "rounded-lg px-3 py-1.5 text-[13px] font-medium";
}

function navStyle(active: boolean): React.CSSProperties {
  return active
    ? { color: "var(--color-gold)", background: "rgba(212,169,74,.12)" }
    : { color: "rgba(255,255,255,.65)" };
}
