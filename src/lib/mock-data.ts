import type {
  ComplianceSnapshot,
  DataAsset,
  Document,
  Organization,
  Task,
  Vendor,
} from "./types";

// ============ ORG ============

export const mockOrg: Organization = {
  id: "org_1",
  name: "אחוות תורה",
  legalName: "אחוות תורה - עמותה רשומה",
  taxId: "580123456",
  type: "nonprofit",
  manager: {
    name: "רחל כהן",
    role: "סמנכ״ל אופרציה",
    email: "rachel@achvat-tora.org.il",
  },
};

// ============ DATA ASSETS ============

export const mockDataAssets: DataAsset[] = [
  {
    id: "asset_1",
    name: "אוהדים ומתעניינים",
    purpose:
      "שליחת תוכן שיווקי, ניהול אירועים, גיוס תומכים חדשים והזמנות לפעילויות העמותה",
    subjectsCount: 14200,
    permissionsCount: 12,
    dataTypes: ["identity", "contact", "demographic", "behavioral", "religious"],
    sensitiveTypes: ["religious"],
    hasSensitiveData: true,
    transferAbroad: true,
    securityLevel: "medium",
    status: "active",
    updatedAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "asset_2",
    name: "עובדים וספקים",
    purpose: "ניהול כוח אדם, שכר וחשבוניות ספקים",
    subjectsCount: 78,
    permissionsCount: 4,
    dataTypes: ["identity", "contact", "financial", "occupation"],
    sensitiveTypes: ["financial"],
    hasSensitiveData: true,
    transferAbroad: true,
    securityLevel: "basic",
    status: "active",
    updatedAt: "2026-03-22T10:00:00Z",
  },
  {
    id: "asset_3",
    name: "תורמים",
    purpose: "ניהול תרומות, הפקת קבלות, שימור קשר עם תורמים",
    subjectsCount: 3200,
    permissionsCount: 8,
    dataTypes: ["identity", "contact", "financial"],
    sensitiveTypes: ["financial"],
    hasSensitiveData: true,
    transferAbroad: true,
    securityLevel: "medium",
    status: "active",
    updatedAt: "2026-04-01T10:00:00Z",
  },
];

// ============ VENDORS ============

export const mockVendors: Vendor[] = [
  {
    id: "vendor_1",
    name: "Google Workspace",
    activity: "דואר אלקטרוני, אחסון קבצים, מסמכים",
    location: "ארה״ב / EU",
    hasStandardDPA: true,
    hasDPA: true,
    dpaSignedAt: "2025-01-15",
    dpaExpiresAt: "2027-01-15",
    riskLevel: "medium",
  },
  {
    id: "vendor_2",
    name: "Monday.com",
    activity: "ניהול משימות ופרויקטים",
    location: "ישראל / ארה״ב",
    hasStandardDPA: true,
    hasDPA: false,
    riskLevel: "medium",
  },
  {
    id: "vendor_3",
    name: "ActiveTrail",
    activity: "דיוור ישיר ושיווק",
    location: "ישראל",
    hasStandardDPA: false,
    hasDPA: true,
    dpaSignedAt: "2024-11-03",
    dpaExpiresAt: "2026-11-03",
    riskLevel: "high",
  },
  {
    id: "vendor_4",
    name: "Salesforce",
    activity: "CRM - ניהול לקוחות",
    location: "ארה״ב",
    hasStandardDPA: true,
    hasDPA: false,
    riskLevel: "high",
  },
];

// ============ TASKS ============

export const mockTasks: Task[] = [
  {
    id: "task_1",
    type: "privacy_policy",
    title: "ניסוח ופרסום מדיניות פרטיות",
    description:
      "מדיניות פרטיות הכוללת מטרות האיסוף, זכויות נושאי המידע, וסוגי המידע הנאסף. יש להציג בבירור בכל נקודת איסוף.",
    status: "awaiting_dpo",
    priority: "high",
    dueDate: "2026-05-15",
    legalReference: "סעיף 11 לחוק",
    module: "deep",
  },
  {
    id: "task_2",
    type: "consent_mechanisms",
    title: "מנגנוני הסכמה בטפסי איסוף",
    description:
      "צ׳קבוקס הסכמה נפרד למדיניות פרטיות ולדיוור ישיר בכל טפסי הרישום והפניה.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-05-20",
    legalReference: "סעיפים 11-12 לחוק",
    module: "deep",
  },
  {
    id: "task_3",
    type: "dpa_vendors",
    title: "החתמת 4 ספקים על הסכמי מיקור חוץ",
    description:
      "כל ספק שמעבד מידע עבורכם חייב לחתום על הסכם לפי תקנה 15: סוג הגישה, משך ההתקשרות, חובות סודיות ואבטחה.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-06-01",
    legalReference: "תקנה 15",
    module: "deep",
  },
  {
    id: "task_4",
    type: "data_minimization",
    title: "סקר צמצום מידע - מאגר אוהדים",
    description:
      "בחינת היקף וסוגי המידע לעומת הנדרש, זיהוי מידע עודף ומחיקתו/אנונימיזציה.",
    status: "not_started",
    priority: "medium",
    dueDate: "2026-07-01",
    legalReference: "תקנה 2(ג)",
    module: "deep",
  },
  {
    id: "task_5",
    type: "dsr_mechanism",
    title: "הקמת מנגנון מענה לפניות נושאי מידע",
    description:
      "תיבת פניות ייעודית למימוש זכויות עיון, תיקון ומחיקה. נוהל מענה תוך 30 יום.",
    status: "not_started",
    priority: "medium",
    dueDate: "2026-06-15",
    legalReference: "סעיפים 13-14 + 17א",
    module: "simple",
  },
  {
    id: "task_6",
    type: "unsubscribe",
    title: "מנגנון הסרה אוטומטי מדיוור",
    description:
      "קישור הסרה בכל דיוור + רשימת הסרות ממוחשבת. חוסר עמידה = פיצוי של 1,000 ₪ ללא הוכחת נזק.",
    status: "completed",
    priority: "medium",
    legalReference: "סעיף 30א לחוק התקשורת",
    module: "simple",
  },
  {
    id: "task_7",
    type: "security_procedure",
    title: "עריכת נוהל אבטחת מידע ארגוני",
    description:
      "נוהל ברמה בינונית: אבטחה פיזית, הרשאות גישה, זיהוי ואימות, ניהול התקנים ניידים, אירועי אבטחה, ביקורות תקופתיות וגיבויים.",
    status: "not_started",
    priority: "high",
    dueDate: "2026-06-30",
    legalReference: "תקנה 4",
    module: "simple",
  },
  {
    id: "task_8",
    type: "logging",
    title: "מנגנון תיעוד גישה (Logging)",
    description:
      "מנגנון אוטומטי המתעד: זהות המשתמש, שעת גישה, רכיב המערכת, סוג הגישה. שמירה לפחות 24 חודשים.",
    status: "not_started",
    priority: "high",
    dueDate: "2026-07-15",
    legalReference: "תקנה 10",
    module: "simple",
  },
  {
    id: "task_9",
    type: "training",
    title: "הדרכת מורשי גישה",
    description:
      "הדרכה על חובות לפי חוק הגנת הפרטיות והתקנות. חובה לכל מורשה חדש לפני מתן הגישה, ולכל המורשים אחת לשנתיים.",
    status: "not_started",
    priority: "medium",
    legalReference: "תקנה 7",
    module: "simple",
  },
  {
    id: "task_10",
    type: "transfer_abroad",
    title: "הסדרת העברת מידע לחו״ל",
    description:
      "תיעוד הבסיס המשפטי להעברת המידע (הסכמת נושא המידע + עמידה בדרישות התקנות להעברות לחו״ל).",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-06-01",
    legalReference: "תקנות העברת מידע לחו״ל",
    module: "simple",
  },
  {
    id: "task_11",
    type: "system_mapping",
    title: "מיפוי מערכות המאגר",
    description: "תיעוד התשתיות, רכיבי התקשורת, תוכנות, וסכמת רשת של המאגר.",
    status: "not_started",
    priority: "medium",
    legalReference: "תקנה 5",
    module: "simple",
  },
  {
    id: "task_12",
    type: "annual_review",
    title: "בחינה שנתית של היקף המידע",
    description:
      "פעם בשנה - בחינה האם היקף וסוגי המידע אינם עולים על הנדרש. מחיקה/אנונימיזציה של מידע עודף.",
    status: "not_started",
    priority: "low",
    legalReference: "תקנה 2(ג)",
    module: "simple",
  },
  {
    id: "task_13",
    type: "audits",
    title: "ביקורות תקופתיות (אחת ל-24 חודשים)",
    description:
      "ביקורת פנימית או חיצונית על ידי גורם מוסמך שאינו ממונה האבטחה.",
    status: "not_started",
    priority: "low",
    legalReference: "תקנה 16",
    module: "simple",
  },
  {
    id: "task_14",
    type: "dpo_appointment",
    title: "מינוי ממונה על הגנת הפרטיות (DPO)",
    description:
      "ארגון עם מידע בעל רגישות מיוחדת בהיקף ניכר - חובה למנות DPO. עורך דין מוסמך מצוות DataBee יכול לשמש בתפקיד.",
    status: "completed",
    priority: "medium",
    legalReference: "תיקון 13 לחוק",
    module: "simple",
  },
];

// ============ DOCUMENTS ============

export const mockDocuments: Document[] = [
  {
    id: "doc_1",
    type: "db_definition",
    title: "מסמך הגדרות מאגר - אוהדים ומתעניינים",
    version: "1.0",
    status: "approved",
    generatedAt: "2026-03-10T10:00:00Z",
    approvedAt: "2026-03-14T10:00:00Z",
  },
  {
    id: "doc_2",
    type: "privacy_policy",
    title: "מדיניות פרטיות - ארגונית",
    version: "0.9",
    status: "under_review",
    generatedAt: "2026-04-12T10:00:00Z",
  },
  {
    id: "doc_3",
    type: "dpa",
    title: "הסכם מיקור חוץ - ActiveTrail",
    version: "1.0",
    status: "approved",
    generatedAt: "2026-02-01T10:00:00Z",
    approvedAt: "2026-02-05T10:00:00Z",
  },
];

// ============ COMPLIANCE ============

export function computeSnapshot(tasks: Task[], docs: Document[]): ComplianceSnapshot {
  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;
  const approvedDocs = docs.filter(
    (d) => d.status === "approved" || d.status === "published",
  ).length;
  const pendingReview = docs.filter((d) => d.status === "under_review").length;
  const highOpen = tasks.filter(
    (t) => t.priority === "high" && t.status !== "completed" && t.status !== "skipped",
  ).length;

  // Weighted score: 70% tasks + 30% approved docs
  const taskScore = total ? (completed / total) * 100 : 0;
  const docScore = docs.length ? (approvedDocs / docs.length) * 100 : 0;
  const score = Math.round(taskScore * 0.7 + docScore * 0.3);

  const upcoming = tasks
    .filter((t) => t.dueDate && t.status !== "completed")
    .map((t) => t.dueDate!)
    .sort()[0];

  return {
    score,
    completedTasks: completed,
    totalTasks: total,
    approvedDocs,
    pendingDpoReview: pendingReview,
    highPriorityOpen: highOpen,
    nextDueDate: upcoming,
  };
}
