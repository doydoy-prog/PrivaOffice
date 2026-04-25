import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DpoZonePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true, name: true },
  });
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-[1000px] px-10 pt-8 pb-16">
      <Link
        href={`/${org.id}`}
        className="btn btn-ghost btn-sm mb-5 inline-flex"
      >
        ← חזרה לדשבורד
      </Link>
      <h1
        className="mb-2 text-[24px] font-extrabold"
        style={{ color: "var(--color-navy)" }}
      >
        שגרת DPO — {org.name}
      </h1>
      <p
        className="mb-7 text-[14px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        כלי עזר לניהול משימות הממונה על הגנת הפרטיות. 58 השאלות מ-
        <code>reference-docs/DPO_assesment_2701.xlsx</code> יוצגו כאן מחולקות
        ל-11 קטגוריות, עם סימון אוטומטי לשאלות שטופלו במודולים.
      </p>
      <div className="card">
        <div className="text-[40px]" style={{ marginBottom: 12 }}>
          🚧
        </div>
        <h2
          className="mb-2 text-[18px] font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          בבנייה
        </h2>
        <p
          className="text-[13.5px] leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          מסך זה יתווסף בצעד מתקדם יותר של הפיתוח (צעד 8 ברשימת הפיתוח של
          CLAUDE.md).
        </p>
      </div>
    </div>
  );
}
