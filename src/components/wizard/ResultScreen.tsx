"use client";

import type { WizardAnswers } from "@/lib/document-generator";
import { generateDbDefinitionDocument } from "@/lib/document-generator";
import {
  calculateSecurityLevel,
  requiresAuthorityNotification,
} from "@/lib/security-engine";
import { generateTasks } from "@/lib/task-generator";
import { TaskList } from "../TaskList";

interface Props {
  answers: WizardAnswers;
  orgName: string;
  onReset: () => void;
}

export function ResultScreen({ answers, orgName, onReset }: Props) {
  const security = calculateSecurityLevel({
    subjectsCount: answers.subjectsCount,
    permissionsCount: answers.permissionsCount,
    sensitiveTypes: answers.sensitiveTypes,
  });

  const tasks = generateTasks({
    hasSensitive: answers.sensitiveTypes.length > 0,
    subjectsCount: answers.subjectsCount,
    permissionsCount: answers.permissionsCount,
    transferAbroad: answers.transferAbroad,
    vendorsCount: answers.vendors.length,
    securityLevel: security.level,
    collectionMethod: answers.collectionMethod,
  });

  const doc = generateDbDefinitionDocument(answers, security, orgName);

  const hasSensitive = answers.sensitiveTypes.length > 0;
  const notifyAuthority = requiresAuthorityNotification({
    subjectsCount: answers.subjectsCount,
    permissionsCount: answers.permissionsCount,
    sensitiveTypes: answers.sensitiveTypes,
  });

  const downloadMarkdown = () => {
    const blob = new Blob([doc.markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${answers.dbName}-הגדרות-מאגר.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const html = `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><title>${doc.title}</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 20px;line-height:1.6;color:#0A1F3D}h1,h2,h3{color:#0A1F3D}h1{border-bottom:3px solid #D4A94A;padding-bottom:8px}h2{margin-top:32px;border-bottom:1px solid #E5E0D0;padding-bottom:4px}strong{color:#A88536}</style></head><body>${doc.htmlContent}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${answers.dbName}-הגדרות-מאגר.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-light p-10 text-center text-white">
        <div className="pointer-events-none absolute -top-40 right-[-20%] h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/20 px-4 py-2 text-xs font-semibold tracking-wider text-gold">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            המסמך הושלם בהצלחה
          </div>
          <h1 className="mt-5 text-3xl font-extrabold">
            מסמך הגדרות מאגר: {answers.dbName}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            סיכמנו את הנתונים, סיווגנו את המאגר לפי חוק הגנת הפרטיות, וזיהינו את
            הצעדים הנדרשים להשלמת ההסדרה. כל מסמך יעבור לסקירת יועץ פרטיות (DPO)
            לפני אישור סופי.
          </p>
        </div>
      </div>

      {/* Classification */}
      <section className="rounded-2xl border border-border bg-bg-card p-7 shadow-soft">
        <div className="mb-5 flex items-center gap-3 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-navy">סיווג המאגר לפי החוק</h3>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <ClassCard
            label="סוג המידע"
            value={hasSensitive ? "מידע בעל רגישות מיוחדת" : "מידע אישי רגיל"}
            detail={
              hasSensitive
                ? `תוספת ראשונה, פרט 1(3) — ${answers.sensitiveTypes.length} סוגים רגישים`
                : "אין מידע הנופל תחת רגישות מיוחדת"
            }
            active={hasSensitive}
          />

          <ClassCard
            label="רמת אבטחה נדרשת"
            value={security.levelHe}
            detail={security.reason}
            navy
          />

          <ClassCard
            label="חובת יידוע הרשות"
            value={notifyAuthority ? "כן — יש ליידע" : "פטור מיידוע"}
            detail={
              notifyAuthority
                ? "מידע רגיש על מעל 100,000 אנשים — חובת הודעת עדכון"
                : "לא חל — פחות מ-100K אנשים עם מידע רגיש"
            }
            active={notifyAuthority}
          />

          <ClassCard
            label="חובת רישום מאגר"
            value="פטור מרישום"
            detail="אחרי תיקון 13, חובת רישום הוגבלה לגופים ציבוריים וסחר במידע"
          />
        </div>

        {hasSensitive && (
          <div className="mt-5 flex gap-4 rounded-xl border-[1.5px] border-gold bg-gradient-to-br from-[#fbf3e2] to-[#f5ecd0] p-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gold text-navy">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-gold-dark">
                מידע בעל רגישות מיוחדת — טיפול מיוחד
              </div>
              <div className="mt-1 text-[13px] leading-relaxed text-navy">
                המשמעות: חובות אבטחה מוגברות, חובות יידוע מחמירות, ופיצוי ללא
                הוכחת נזק במקרה של הפרה.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tasks */}
      <TaskList tasks={tasks} />

      {/* Preview */}
      <section className="rounded-2xl border border-border bg-bg-card p-7 shadow-soft">
        <div className="mb-5 flex items-center gap-3 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-navy">תצוגה מקדימה של המסמך</h3>
        </div>
        <div
          className="prose prose-sm max-w-none rounded-xl border border-border bg-bg p-5 text-[13.5px] leading-relaxed"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: doc.htmlContent }}
        />
      </section>

      {/* Export */}
      <section className="rounded-2xl border border-border bg-bg-card p-7 shadow-soft">
        <div className="mb-5 flex items-center gap-3 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-navy">יצוא המסמך</h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={downloadHtml}
            className="rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-gold transition-all hover:-translate-y-px hover:bg-navy-light"
          >
            הורד כ-HTML
          </button>
          <button
            type="button"
            onClick={downloadMarkdown}
            className="rounded-xl border border-border bg-bg-card px-6 py-3 text-sm font-semibold text-text-muted transition-colors hover:border-navy hover:text-navy"
          >
            הורד כ-Markdown
          </button>
          <button
            type="button"
            onClick={() => alert("בפאזה 6: יצירת Word מלא + PDF עם חתימת DPO")}
            className="rounded-xl border border-border bg-bg-card px-6 py-3 text-sm font-semibold text-text-muted transition-colors hover:border-navy hover:text-navy"
          >
            הורד כ-Word (בפאזה 6)
          </button>
          <button
            type="button"
            onClick={() =>
              alert(
                "בפאזה 6: שליחת המסמך ל-DPO עם התראה במערכת ובאימייל, סטטוס עובר ל-under_review",
              )
            }
            className="rounded-xl bg-gold px-6 py-3 text-sm font-bold text-navy transition-all hover:-translate-y-px hover:bg-gold-bright"
          >
            שלח ל-DPO לאישור
          </button>
          <button
            type="button"
            onClick={onReset}
            className="mr-auto rounded-xl border border-border bg-bg-card px-6 py-3 text-sm text-text-muted transition-colors hover:border-danger hover:text-danger"
          >
            התחל מאגר חדש
          </button>
        </div>
      </section>
    </div>
  );
}

function ClassCard({
  label,
  value,
  detail,
  active,
  navy,
}: {
  label: string;
  value: string;
  detail: string;
  active?: boolean;
  navy?: boolean;
}) {
  const style = navy
    ? "bg-gradient-to-br from-navy to-navy-light border-navy text-white"
    : active
      ? "bg-gradient-to-br from-[#fbf3e2] to-[#f5ecd0] border-gold"
      : "border-border bg-bg-card";

  return (
    <div className={`rounded-xl border-[1.5px] p-4 ${style}`}>
      <div
        className={`text-[10.5px] font-semibold uppercase tracking-wider ${
          navy ? "text-gold" : active ? "text-gold-dark" : "text-text-muted"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-bold ${
          navy ? "text-white" : "text-navy"
        }`}
      >
        {value}
      </div>
      <div
        className={`mt-1 text-[12.5px] leading-relaxed ${
          navy ? "text-white/75" : "text-text-muted"
        }`}
      >
        {detail}
      </div>
    </div>
  );
}
