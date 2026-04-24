// Registry of compliance tasks, mirroring the prototype's TASKS array and
// CLAUDE.md "DPO Assessment → Module Mapping" section.

export type TaskType = "deep" | "simple";
export type TaskPriority = "high" | "medium" | "low";

export interface TaskDefinition {
  id: string;
  title: string;
  sub: string;
  desc: string;
  icon: string;
  priority: TaskPriority;
  type: TaskType;
  legalRef: string;
  dpoSheet: string | null;
}

export const TASKS: TaskDefinition[] = [
  {
    id: "db_definition",
    title: "מסמך הגדרות מאגר",
    sub: "תקנה 2",
    desc: "הגדרת פעולות האיסוף, מטרות, סוגי מידע, סיכונים, בעלי תפקידים.",
    icon: "📋",
    priority: "high",
    type: "deep",
    legalRef: "תקנה 2",
    dpoSheet: "4.1",
  },
  {
    id: "privacy_policy",
    title: "מדיניות פרטיות",
    sub: "סעיף 11",
    desc: "ניסוח מדיניות פרטיות מלאה.",
    icon: "📜",
    priority: "high",
    type: "deep",
    legalRef: "סעיף 11",
    dpoSheet: "1",
  },
  {
    id: "consent_mechanism",
    title: "מנגנוני הסכמה",
    sub: "סעיפים 11-12",
    desc: "צ'קבוקסי הסכמה לכל נקודת איסוף.",
    icon: "☑️",
    priority: "high",
    type: "deep",
    legalRef: "סעיפים 11-12",
    dpoSheet: "2",
  },
  {
    id: "dpa_vendors",
    title: "הסכמי ספקים (DPA)",
    sub: "תקנה 15",
    desc: "הסכמי מיקור חוץ עם כל ספק.",
    icon: "🤝",
    priority: "high",
    type: "deep",
    legalRef: "תקנה 15",
    dpoSheet: null,
  },
  {
    id: "data_minimization",
    title: "צמצום מידע",
    sub: "תקנה 2(ג)",
    desc: "בחינה שנתית של מידע עודף.",
    icon: "🗑️",
    priority: "medium",
    type: "deep",
    legalRef: "תקנה 2(ג)",
    dpoSheet: "3",
  },
  {
    id: "dsr_mechanism",
    title: "פניות נושאי מידע",
    sub: "סעיפים 13-14",
    desc: "מנגנון עיון, תיקון ומחיקה.",
    icon: "✉️",
    priority: "medium",
    type: "simple",
    legalRef: "סעיפים 13-14",
    dpoSheet: "9",
  },
  {
    id: "unsubscribe",
    title: "הסרה מדיוור",
    sub: "סעיף 30א",
    desc: "קישור הסרה + רשימת הסרות.",
    icon: "🚫",
    priority: "medium",
    type: "simple",
    legalRef: "סעיף 30א",
    dpoSheet: "7",
  },
  {
    id: "transfer_abroad",
    title: "העברות לחו\"ל",
    sub: "תקנות העברה",
    desc: "בסיס משפטי להעברת מידע.",
    icon: "🌍",
    priority: "medium",
    type: "simple",
    legalRef: "תקנות העברה",
    dpoSheet: null,
  },
  {
    id: "security_policy",
    title: "נוהל אבטחת מידע",
    sub: "תקנה 4",
    desc: "נוהל ארגוני ברמה בינונית.",
    icon: "🔒",
    priority: "high",
    type: "simple",
    legalRef: "תקנה 4",
    dpoSheet: "4",
  },
  {
    id: "logging",
    title: "בקרה ותיעוד גישה",
    sub: "תקנה 10",
    desc: "מנגנון תיעוד גישה אוטומטי.",
    icon: "📊",
    priority: "high",
    type: "simple",
    legalRef: "תקנה 10",
    dpoSheet: "5",
  },
  {
    id: "training",
    title: "הדרכת מורשי גישה",
    sub: "תקנה 7",
    desc: "הדרכה תקופתית לבעלי הרשאות.",
    icon: "🎓",
    priority: "medium",
    type: "simple",
    legalRef: "תקנה 7",
    dpoSheet: "8",
  },
  {
    id: "system_mapping",
    title: "מיפוי מערכות",
    sub: "תקנה 5",
    desc: "תיעוד תשתיות ורכיבים.",
    icon: "🗺️",
    priority: "medium",
    type: "simple",
    legalRef: "תקנה 5",
    dpoSheet: null,
  },
  {
    id: "annual_review",
    title: "בחינה שנתית",
    sub: "תקנה 2(ג)",
    desc: "בחינת היקף מידע מול מטרות.",
    icon: "🔄",
    priority: "low",
    type: "simple",
    legalRef: "תקנה 2(ג)",
    dpoSheet: null,
  },
  {
    id: "audits",
    title: "ביקורות תקופתיות",
    sub: "תקנה 16",
    desc: "ביקורת כל 24 חודשים.",
    icon: "🔍",
    priority: "low",
    type: "simple",
    legalRef: "תקנה 16",
    dpoSheet: "5",
  },
  {
    id: "registration",
    title: "רישום מאגרים",
    sub: "סעיף 9",
    desc: "בדיקת חובת רישום והודעה.",
    icon: "📝",
    priority: "low",
    type: "simple",
    legalRef: "סעיף 9",
    dpoSheet: "6",
  },
  {
    id: "board_oversight",
    title: "אחריות דירקטוריון",
    sub: "הנחיה 1/2022",
    desc: "פיקוח הנהלה על הגנת פרטיות.",
    icon: "🏛️",
    priority: "low",
    type: "simple",
    legalRef: "הנחיה 1/2022",
    dpoSheet: "10",
  },
];

export function findTask(id: string): TaskDefinition | undefined {
  return TASKS.find((t) => t.id === id);
}
