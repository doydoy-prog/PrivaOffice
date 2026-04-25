import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { findTask } from "@/lib/tasks";
import { sourcesForModule, primarySourcesForModule } from "@/lib/legal-sources";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ orgId: string; taskId: string }>;
}) {
  const { orgId, taskId } = await params;

  const [org, task] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true },
    }),
    Promise.resolve(findTask(taskId)),
  ]);
  if (!org || !task) notFound();

  const primary = primarySourcesForModule(task.id);
  const related = sourcesForModule(task.id).filter((s) => !s.primary);

  return (
    <div className="mx-auto max-w-[900px] px-10 pt-8 pb-16">
      <Link
        href={`/${org.id}`}
        className="btn btn-ghost btn-sm mb-5 inline-flex"
      >
        ← חזרה לדשבורד
      </Link>

      <div className="mb-2 flex items-center gap-3.5">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            background: "var(--color-navy)",
            color: "var(--color-gold)",
          }}
        >
          {task.icon}
        </div>
        <h1
          className="text-[24px] font-extrabold"
          style={{ color: "var(--color-navy)" }}
        >
          {task.title}
        </h1>
      </div>
      <p
        className="mb-7 text-[14px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {task.sub} · {task.desc}
      </p>

      {primary.length > 0 && (
        <section className="card mb-4">
          <h3
            className="mb-3 text-[17px] font-bold"
            style={{ color: "var(--color-navy)" }}
          >
            📖 מקורות משפטיים ראשיים
          </h3>
          <ul className="space-y-2">
            {primary.map((s) => (
              <li key={s.slug}>
                <a
                  href={`/legal-sources/${s.slug}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px]"
                  style={{ color: "var(--color-gold-deep)" }}
                >
                  📄 {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="card mb-4">
          <h3
            className="mb-3 text-[17px] font-bold"
            style={{ color: "var(--color-navy)" }}
          >
            📚 מקורות קשורים
          </h3>
          <ul className="space-y-2">
            {related.map((s) => (
              <li key={s.slug}>
                <a
                  href={`/legal-sources/${s.slug}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13.5px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="card">
        <div className="text-[40px]" style={{ marginBottom: 12 }}>
          🚧
        </div>
        <h2
          className="mb-2 text-[18px] font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          תוכן המודול בבנייה
        </h2>
        <p
          className="text-[13.5px] leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          המודול המלא (הדרכה, צ'קליסט, טפסים, צ'אט עם עמית) ייבנה בצעדים הבאים
          של הפיתוח. כבר עכשיו זמינים כאן המקורות המשפטיים של הרשות להגנת
          הפרטיות ושל המחוקק הישראלי.
        </p>
      </div>
    </div>
  );
}
