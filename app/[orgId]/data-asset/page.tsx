import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DataAssetPage({
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
    <div className="mx-auto max-w-[800px] px-10 pt-8 pb-16">
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
        הגדרות מאגר מידע
      </h1>
      <p
        className="mb-7 text-[14px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        טופס מלא יתווסף בצעד הבא של הפיתוח. הטופס יכלול: סוגי מידע ורגישות, מטרות
        שימוש, שיטות איסוף, ספקים, מנהל מאגר, וחישוב אוטומטי של רמת אבטחה.
      </p>
      <div className="card">
        <div className="text-[40px]" style={{ marginBottom: 12 }}>
          🚧
        </div>
        <h2
          className="mb-2 text-[18px] font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          בבנייה — צעד הבא
        </h2>
        <p
          className="text-[13.5px] leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          מסך זה ישכפל את טופס העריכה מה-prototype (
          <code>prototype/DataBee_Platform.html</code>, <code>renderEditDb</code>
          ) עם persistence ל-Prisma.
        </p>
      </div>
    </div>
  );
}
