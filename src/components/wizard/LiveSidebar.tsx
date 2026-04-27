"use client";

import type { WizardAnswers } from "@/lib/document-generator";
import { calculateSecurityLevel } from "@/lib/security-engine";
import { formatNumber } from "@/lib/utils";

interface Props {
  answers: Partial<WizardAnswers>;
  currentStepId: string;
  progressPct: number;
}

const COLLECTION_LABELS: Record<string, string> = {
  direct: "ישירות מנושאי המידע",
  thirdParty: "מצדדים שלישיים",
  mixed: "שילוב",
};

export function LiveSidebar({ answers, currentStepId, progressPct }: Props) {
  const hasAnswer = (id: string) => {
    switch (id) {
      case "dbName":
        return !!answers.dbName;
      case "purpose":
        return !!answers.purpose;
      case "collectionMethod":
        return !!answers.collectionMethod;
      case "subjectsCount":
        return !!answers.subjectsCount;
      case "permissionsCount":
        return !!answers.permissionsCount;
      case "dataTypes":
        return (answers.dataTypes || []).length > 0;
      case "subjectCategories":
        return (answers.subjectCategories || []).length > 0;
      case "transferAbroad":
        return answers.transferAbroad !== undefined;
      case "vendors":
        return answers.vendors !== undefined;
      case "manager":
        return !!(answers.manager && answers.manager.name);
      default:
        return false;
    }
  };

  const circumference = 2 * Math.PI * 25;
  const offset = circumference - (progressPct / 100) * circumference;

  const canComputeSecurity =
    answers.subjectsCount &&
    answers.permissionsCount &&
    (answers.dataTypes || []).length > 0;

  const security = canComputeSecurity
    ? calculateSecurityLevel({
        subjectsCount: answers.subjectsCount || 0,
        permissionsCount: answers.permissionsCount || 0,
        sensitiveTypes: answers.sensitiveTypes || [],
      })
    : null;

  return (
    <aside className="sticky top-[76px] flex h-[calc(100vh-96px)] flex-col gap-3 overflow-y-auto rounded-2xl bg-navy p-6 text-white">
      {/* Header */}
      <header className="mb-2">
        <div className="text-[10.5px] font-semibold uppercase tracking-[1.8px] text-gold">
          סטטוס חי
        </div>
        <h2 className="mt-1 text-lg font-bold leading-tight">
          המסמך שלך בזמן אמת
        </h2>
      </header>

      {/* Completion ring */}
      <div className="flex items-center gap-4 rounded-xl bg-white/5 p-3.5">
        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="5"
          />
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#D4A94A"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
          <text
            x="30"
            y="30"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="15"
            fontWeight="700"
            fill="white"
            transform="rotate(90 30 30)"
          >
            {Math.round(progressPct)}%
          </text>
        </svg>
        <div className="flex-1">
          <div className="text-sm font-semibold">התקדמות מילוי</div>
          <div className="text-xs text-white/60">
            {progressPct < 25
              ? "בהתחלה - יש עוד הרבה"
              : progressPct < 50
                ? "מתקדמים יפה"
                : progressPct < 75
                  ? "יותר מחצי!"
                  : progressPct < 100
                    ? "כמעט בסיום"
                    : "הושלם 🎉"}
          </div>
        </div>
      </div>

      <SidebarCard
        label="שם המאגר"
        value={answers.dbName || "—"}
        empty={!answers.dbName}
        highlight={currentStepId === "dbName"}
      />

      <SidebarCard
        label="מטרת השימוש"
        value={answers.purpose ? truncate(answers.purpose, 70) : "—"}
        empty={!answers.purpose}
        highlight={currentStepId === "purpose"}
      />

      <SidebarCard
        label="אופן איסוף"
        value={
          answers.collectionMethod
            ? COLLECTION_LABELS[answers.collectionMethod]
            : "—"
        }
        empty={!answers.collectionMethod}
        highlight={currentStepId === "collectionMethod"}
      />

      <SidebarCard
        label="נושאי מידע"
        value={answers.subjectsCount ? formatNumber(answers.subjectsCount) : "—"}
        detail={
          answers.subjectsCount && answers.subjectsCount >= 100000
            ? "מעל 100K — מחייב רמה גבוהה"
            : undefined
        }
        empty={!answers.subjectsCount}
        highlight={currentStepId === "subjectsCount"}
      />

      <SidebarCard
        label="מורשי גישה"
        value={answers.permissionsCount ? `${answers.permissionsCount}` : "—"}
        empty={!answers.permissionsCount}
        highlight={currentStepId === "permissionsCount"}
      />

      <SidebarCard
        label="סוגי מידע"
        value={
          (answers.dataTypes || []).length > 0
            ? `${(answers.dataTypes || []).length} סוגים`
            : "—"
        }
        detail={
          (answers.sensitiveTypes || []).length > 0
            ? `⚠ ${(answers.sensitiveTypes || []).length} מידע רגיש`
            : undefined
        }
        empty={!(answers.dataTypes || []).length}
        highlight={currentStepId === "dataTypes"}
      />

      {security && (
        <div className="rounded-xl bg-gradient-to-br from-gold to-gold-bright p-4 text-navy">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.5px] opacity-75">
            רמת אבטחה נדרשת
          </div>
          <div className="mt-1 text-xl font-bold">{security.levelHe}</div>
          <div className="mt-1 text-xs leading-relaxed opacity-80">
            {security.reason}
          </div>
        </div>
      )}

      <SidebarCard
        label='העברת מידע לחו"ל'
        value={
          answers.transferAbroad === undefined
            ? "—"
            : answers.transferAbroad
              ? 'כן — לחו"ל'
              : "לא — ישראל בלבד"
        }
        empty={answers.transferAbroad === undefined}
        highlight={currentStepId === "transferAbroad"}
      />

      <SidebarCard
        label="ספקים חיצוניים"
        value={
          answers.vendors === undefined
            ? "—"
            : answers.vendors.length
              ? `${answers.vendors.length} ספקים`
              : "אין"
        }
        empty={answers.vendors === undefined}
        highlight={currentStepId === "vendors"}
      />

      {answers.manager?.name && (
        <SidebarCard
          label="מנהל המאגר"
          value={answers.manager.name}
          detail={answers.manager.role}
          highlight={currentStepId === "manager"}
        />
      )}
    </aside>
  );
}

function SidebarCard({
  label,
  value,
  detail,
  empty,
  highlight,
}: {
  label: string;
  value: string;
  detail?: string;
  empty?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        highlight
          ? "animate-pulse-gold border-gold/35 bg-gold/10"
          : "border-white/8 bg-white/5"
      }`}
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-gold">
        {label}
      </div>
      <div
        className={`mt-1 font-bold leading-tight ${
          empty
            ? "text-sm italic text-text-soft"
            : "text-base text-white"
        }`}
      >
        {value}
      </div>
      {detail && !empty && (
        <div className="mt-1 text-xs leading-snug text-white/65">{detail}</div>
      )}
    </div>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
