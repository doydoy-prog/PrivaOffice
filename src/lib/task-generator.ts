// Task generator. Given a data asset profile (answers from the questionnaire)
// and the computed security level, returns the list of compliance tasks the
// organization must complete. Each task references the legal basis so the
// client can see where the requirement comes from.

import type { SecurityLevel, Task, TaskType, Priority } from "./types";

export interface TaskInput {
  hasSensitive: boolean;
  subjectsCount: number;
  permissionsCount: number;
  transferAbroad: boolean;
  vendorsCount: number;
  securityLevel: SecurityLevel;
  collectionMethod: "direct" | "thirdParty" | "mixed";
  commercialPurpose?: boolean;
}

interface TaskDef {
  type: TaskType;
  title: string;
  description: string;
  priority: Priority;
  legalReference: string;
  module: "deep" | "simple";
  dueDays?: number; // days from today
}

function newTaskId(type: TaskType, idx: number): string {
  return `task_${type}_${idx}_${Math.random().toString(36).slice(2, 8)}`;
}

function withDueDate(dueDays?: number): string | undefined {
  if (!dueDays) return undefined;
  const d = new Date();
  d.setDate(d.getDate() + dueDays);
  return d.toISOString();
}

export function generateTasks(input: TaskInput): Task[] {
  const defs: TaskDef[] = [];

  // ===== Always required =====

  defs.push({
    type: "privacy_policy",
    title: "ניסוח ופרסום מדיניות פרטיות",
    description:
      "מדיניות פרטיות מלאה לפי סעיף 11 - מטרות איסוף, סוגי המידע, זכויות נושאי המידע, אמצעי יצירת קשר. פרסום בכל נקודת איסוף ובאתר.",
    priority: "high",
    legalReference: "סעיף 11 לחוק",
    module: "deep",
    dueDays: 30,
  });

  defs.push({
    type: "consent_mechanisms",
    title: "מנגנוני הסכמה בטפסי איסוף",
    description:
      "צ׳קבוקס הסכמה נפרד (לא מסומן מראש) למדיניות פרטיות, לדיוור ישיר, ולמידע רגיש. הסכמה שיווקית לא יכולה להיות תנאי לשירות.",
    priority: "high",
    legalReference: "סעיפים 11-12 לחוק",
    module: "deep",
    dueDays: 30,
  });

  defs.push({
    type: "dsr_mechanism",
    title: "מנגנון מענה לפניות נושאי מידע (DSR)",
    description:
      "תיבת פניות ייעודית למימוש זכויות עיון (ס׳ 13), תיקון (ס׳ 14) ומחיקה (ס׳ 17א). נוהל מענה תוך 30 יום.",
    priority: "medium",
    legalReference: "סעיפים 13-14 + 17א",
    module: "simple",
    dueDays: 45,
  });

  defs.push({
    type: "unsubscribe",
    title: "מנגנון הסרה אוטומטי מדיוור",
    description:
      "קישור הסרה בכל דיוור + רשימת הסרות ממוחשבת. חוסר עמידה = פיצוי של 1,000 ₪ ללא הוכחת נזק לפי חוק התקשורת.",
    priority: "medium",
    legalReference: "סעיף 30א לחוק התקשורת",
    module: "simple",
    dueDays: 30,
  });

  defs.push({
    type: "annual_review",
    title: "בחינה שנתית של היקף המידע",
    description:
      "פעם בשנה - בחינה האם היקף וסוגי המידע אינם עולים על הנדרש למטרה. מחיקה / אנונימיזציה של מידע עודף.",
    priority: "low",
    legalReference: "תקנה 2(ג)",
    module: "simple",
    dueDays: 365,
  });

  // ===== Only if there are external vendors =====

  if (input.vendorsCount > 0) {
    defs.push({
      type: "dpa_vendors",
      title: `החתמת ${input.vendorsCount} ספקים על הסכם מיקור חוץ (DPA)`,
      description:
        "לפי תקנה 15 - הסכם בכתב עם כל מחזיק/מעבד: סוג הגישה, משך ההתקשרות, חובות סודיות, אבטחה, והחזרה/מחיקה בסיום.",
      priority: "high",
      legalReference: "תקנה 15",
      module: "deep",
      dueDays: 60,
    });
  }

  // ===== Only if transfer abroad =====

  if (input.transferAbroad) {
    defs.push({
      type: "transfer_abroad",
      title: "הסדרת העברת מידע לחו״ל",
      description:
        "תיעוד הבסיס המשפטי: הסכמת נושא המידע + עמידה בדרישות התקנות (מדינה מוכרת / הסכם מתאים / חריג חוקי).",
      priority: "medium",
      legalReference: "תקנות הגנת הפרטיות (העברת מידע לחו״ל) תשס״א-2001",
      module: "simple",
      dueDays: 45,
    });
  }

  // ===== MEDIUM + HIGH security level =====

  if (input.securityLevel === "medium" || input.securityLevel === "high") {
    defs.push({
      type: "security_procedure",
      title: "עריכת נוהל אבטחת מידע ארגוני",
      description: `נוהל בהיקף המתאים לרמה ${input.securityLevel === "high" ? "הגבוהה" : "הבינונית"}: אבטחה פיזית, הרשאות גישה, זיהוי ואימות, ניהול התקנים ניידים, אירועי אבטחה, ביקורות, גיבויים.`,
      priority: "high",
      legalReference: "תקנה 4",
      module: "simple",
      dueDays: 60,
    });

    defs.push({
      type: "logging",
      title: "מנגנון תיעוד גישה (Logging)",
      description:
        "תיעוד אוטומטי: זהות המשתמש, שעת גישה, רכיב המערכת, סוג הגישה. שמירה לפחות 24 חודשים. חלק מדרישות תקנה 10.",
      priority: "high",
      legalReference: "תקנה 10",
      module: "simple",
      dueDays: 60,
    });

    defs.push({
      type: "training",
      title: "הדרכת מורשי גישה",
      description:
        "הדרכה על חובות לפי חוק הגנת הפרטיות והתקנות. חובה לכל מורשה חדש לפני מתן הגישה, ולכל המורשים אחת לשנתיים לפחות.",
      priority: "medium",
      legalReference: "תקנה 7",
      module: "simple",
      dueDays: 90,
    });

    defs.push({
      type: "system_mapping",
      title: "מיפוי מערכות המאגר",
      description:
        "תיעוד התשתיות, רכיבי התקשורת, תוכנות, סכמת רשת. עדכון בכל שינוי משמעותי.",
      priority: "medium",
      legalReference: "תקנה 5",
      module: "simple",
      dueDays: 60,
    });

    defs.push({
      type: "audits",
      title: "ביקורות תקופתיות (אחת ל-24 חודשים)",
      description:
        "ביקורת פנימית או חיצונית על ידי גורם מוסמך שאינו ממונה האבטחה. תיעוד ממצאים ותוכנית תיקון.",
      priority: "low",
      legalReference: "תקנה 16",
      module: "simple",
      dueDays: 180,
    });
  }

  // ===== HIGH only =====

  if (input.securityLevel === "high") {
    defs.push({
      type: "penetration_test",
      title: "סקר סיכונים ומבדקי חדירות",
      description:
        "אחת ל-18 חודשים לפחות - סקר סיכוני אבטחה ומבדקי חדירות למערכות המאגר על ידי גורם מקצועי.",
      priority: "high",
      legalReference: "תקנה 5(ג)+(ד)",
      module: "simple",
      dueDays: 120,
    });
  }

  // ===== Sensitive data on many subjects → DPO =====

  if (input.hasSensitive && input.subjectsCount > 10000) {
    defs.push({
      type: "dpo_appointment",
      title: "מינוי ממונה על הגנת הפרטיות (DPO)",
      description:
        "ארגון עם מידע בעל רגישות מיוחדת בהיקף ניכר - חובה למנות DPO לפי תיקון 13. עורך דין מצוות DataBee יכול לשמש בתפקיד.",
      priority: "medium",
      legalReference: "תיקון 13 לחוק הגנת הפרטיות",
      module: "simple",
      dueDays: 90,
    });
  }

  // ===== Always last: data minimization review =====

  defs.push({
    type: "data_minimization",
    title: "סקר צמצום מידע ראשוני",
    description:
      "מיפוי כל סוגי המידע הנאסף ובחינה אם יש מידע עודף שאין לו מטרה ברורה. מחיקה/אנונימיזציה של מידע עודף.",
    priority: "medium",
    legalReference: "מדיניות הרשות להגנת הפרטיות 2021",
    module: "deep",
    dueDays: 75,
  });

  // Materialize to Task[] with ids and dates
  return defs.map((def, idx) => ({
    id: newTaskId(def.type, idx),
    type: def.type,
    title: def.title,
    description: def.description,
    status: "not_started",
    priority: def.priority,
    dueDate: withDueDate(def.dueDays),
    legalReference: def.legalReference,
    module: def.module,
  }));
}
