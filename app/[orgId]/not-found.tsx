import Link from "next/link";

export default function OrgNotFound() {
  return (
    <div className="mx-auto max-w-[560px] px-5 py-16 text-center">
      <h1
        className="mb-3 text-[24px] font-extrabold"
        style={{ color: "var(--color-navy)" }}
      >
        הלקוח לא נמצא
      </h1>
      <p
        className="mb-6 text-[14px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        ייתכן שהלקוח נמחק או שהקישור שגוי.
      </p>
      <Link href="/" className="btn btn-primary">
        חזרה לרשימת הלקוחות
      </Link>
    </div>
  );
}
