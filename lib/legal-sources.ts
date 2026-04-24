// Catalog of official Israeli privacy-law sources used to ground module content
// and the "עמית" AI system prompt. Files live under /public/legal-sources and
// are served at /legal-sources/<slug>.pdf.
//
// Publishers:
//   - knesset: Israeli Knesset (primary legislation)
//   - ppa: Israel's Privacy Protection Authority (הרשות להגנת הפרטיות)
//
// The moduleIds field matches TASKS ids from lib/tasks.ts.

export type SourcePublisher = "knesset" | "ppa";

export interface LegalSource {
  slug: string;
  title: string;
  publisher: SourcePublisher;
  topics: string[];
  moduleIds: string[];
  primary?: boolean;
}

export const LEGAL_SOURCES: LegalSource[] = [
  {
    slug: "privacy-protection-law-1981",
    title: "חוק הגנת הפרטיות, התשמ\"א-1981",
    publisher: "knesset",
    topics: ["law", "foundational"],
    moduleIds: [
      "db_definition",
      "privacy_policy",
      "consent_mechanism",
      "dpa_vendors",
      "data_minimization",
      "dsr_mechanism",
      "unsubscribe",
      "transfer_abroad",
      "security_policy",
      "logging",
      "training",
      "system_mapping",
      "annual_review",
      "audits",
      "registration",
      "board_oversight",
    ],
    primary: true,
  },
  {
    slug: "data-security-regulations-2017",
    title: "תקנות הגנת הפרטיות (אבטחת מידע), התשע\"ז-2017",
    publisher: "knesset",
    topics: ["regulations", "security"],
    moduleIds: [
      "db_definition",
      "security_policy",
      "logging",
      "training",
      "system_mapping",
      "audits",
      "data_minimization",
    ],
    primary: true,
  },
  {
    slug: "amendment-13",
    title: "תיקון 13 לחוק הגנת הפרטיות",
    publisher: "knesset",
    topics: ["amendment"],
    moduleIds: [
      "registration",
      "db_definition",
      "privacy_policy",
      "board_oversight",
    ],
    primary: true,
  },
  {
    slug: "amendment-13-deepfake",
    title: "תיקון 13 - deepfake ומידע אישי",
    publisher: "ppa",
    topics: ["amendment", "deepfake"],
    moduleIds: ["privacy_policy", "consent_mechanism"],
  },
  {
    slug: "data-minimization",
    title: "מדיניות הרשות בנושא צמצום מידע",
    publisher: "ppa",
    topics: ["minimization"],
    moduleIds: ["data_minimization", "annual_review"],
    primary: true,
  },
  {
    slug: "data-minimization-public-hearing",
    title: "צמצום מידע - שימוע ציבורי",
    publisher: "ppa",
    topics: ["minimization"],
    moduleIds: ["data_minimization", "annual_review"],
  },
  {
    slug: "opinion-dpo",
    title: "גילוי דעת - תפקיד ה-DPO",
    publisher: "ppa",
    topics: ["dpo", "governance"],
    moduleIds: ["board_oversight"],
    primary: true,
  },
  {
    slug: "opinion-consent",
    title: "גילוי דעת - הסכמה מדעת",
    publisher: "ppa",
    topics: ["consent"],
    moduleIds: ["consent_mechanism"],
    primary: true,
  },
  {
    slug: "notice-duty",
    title: "חובת יידוע נושאי מידע",
    publisher: "ppa",
    topics: ["notice"],
    moduleIds: ["privacy_policy"],
    primary: true,
  },
  {
    slug: "notice-duty-collection-use",
    title: "חובת יידוע במסגרת איסוף ושימוש במידע אישי",
    publisher: "ppa",
    topics: ["notice"],
    moduleIds: ["privacy_policy", "consent_mechanism"],
  },
  {
    slug: "direct-marketing-interpretation",
    title: "פרשנות סעיף 30א - דיוור ישיר",
    publisher: "ppa",
    topics: ["direct_marketing"],
    moduleIds: ["unsubscribe"],
    primary: true,
  },
  {
    slug: "direct-marketing-data-acquisition",
    title: "רכישת דאטה לצרכי דיוור ישיר",
    publisher: "ppa",
    topics: ["direct_marketing"],
    moduleIds: ["unsubscribe", "registration"],
  },
  {
    slug: "direct-marketing-data-acquisition-guide",
    title: "קווים מנחים לרכישת מידע לצרכי דיוור ישיר",
    publisher: "ppa",
    topics: ["direct_marketing"],
    moduleIds: ["unsubscribe", "registration"],
  },
  {
    slug: "outsourcing-personal-data-processing",
    title: "מיקור חוץ בעיבוד מידע אישי",
    publisher: "ppa",
    topics: ["dpa", "outsourcing"],
    moduleIds: ["dpa_vendors"],
    primary: true,
  },
  {
    slug: "third-party-contracts",
    title: "התקשרות עם צד ג' - פרטיות",
    publisher: "ppa",
    topics: ["dpa", "contracts"],
    moduleIds: ["dpa_vendors"],
  },
  {
    slug: "data-transfer-usa",
    title: "העברת מידע לארצות הברית",
    publisher: "ppa",
    topics: ["transfer_abroad"],
    moduleIds: ["transfer_abroad"],
  },
  {
    slug: "regulation-3-interpretation",
    title: "פרשנות תקנה 3 - העברת מידע לחו\"ל",
    publisher: "ppa",
    topics: ["transfer_abroad"],
    moduleIds: ["transfer_abroad"],
    primary: true,
  },
  {
    slug: "regulation-3-cross-border-interpretation",
    title: "פרשנות תקנה 3 - מאגרים מחוץ לגבולות המדינה",
    publisher: "ppa",
    topics: ["transfer_abroad"],
    moduleIds: ["transfer_abroad"],
  },
  {
    slug: "access-right",
    title: "זכות העיון - סעיף 13",
    publisher: "ppa",
    topics: ["dsr"],
    moduleIds: ["dsr_mechanism"],
    primary: true,
  },
  {
    slug: "access-right-video-audio",
    title: "זכות עיון בוידאו וקול",
    publisher: "ppa",
    topics: ["dsr"],
    moduleIds: ["dsr_mechanism"],
  },
  {
    slug: "minimum-identification-access-request",
    title: "דרישת מינימום לזיהוי בפניית עיון",
    publisher: "ppa",
    topics: ["dsr"],
    moduleIds: ["dsr_mechanism"],
  },
  {
    slug: "data-portability-right",
    title: "הזכות לניוד מידע",
    publisher: "ppa",
    topics: ["dsr"],
    moduleIds: ["dsr_mechanism"],
  },
  {
    slug: "risk-survey-penetration-test",
    title: "סקר סיכונים ומבדק חדירות",
    publisher: "ppa",
    topics: ["security"],
    moduleIds: ["security_policy", "audits"],
    primary: true,
  },
  {
    slug: "remote-work",
    title: "עבודה מרחוק והגנת מידע",
    publisher: "ppa",
    topics: ["security"],
    moduleIds: ["security_policy"],
  },
  {
    slug: "board-of-directors-role",
    title: "תפקיד הדירקטוריון בהגנת הפרטיות (הנחיה 1/2022)",
    publisher: "ppa",
    topics: ["governance"],
    moduleIds: ["board_oversight"],
    primary: true,
  },
  {
    slug: "email-collection-as-database",
    title: "אוסף כתובות מייל כמאגר מידע",
    publisher: "ppa",
    topics: ["database_scope"],
    moduleIds: ["db_definition", "registration"],
  },
  {
    slug: "id-collection-and-photograph",
    title: "איסוף וצילום תעודת זהות",
    publisher: "ppa",
    topics: ["database_scope"],
    moduleIds: ["db_definition", "data_minimization"],
  },
  {
    slug: "id-numbers-collection",
    title: "איסוף מספרי תעודות זהות וצילום תעודות זהות",
    publisher: "ppa",
    topics: ["database_scope"],
    moduleIds: ["db_definition", "data_minimization"],
  },
  {
    slug: "biometric-data-workplace",
    title: "מידע ביומטרי במקום העבודה",
    publisher: "ppa",
    topics: ["sensitive_data", "biometric"],
    moduleIds: ["db_definition", "data_minimization"],
  },
  {
    slug: "biometric-attendance-workplace",
    title: "איסוף ושימוש במידע ביומטרי לנוכחות עובדים",
    publisher: "ppa",
    topics: ["sensitive_data", "biometric"],
    moduleIds: ["db_definition", "data_minimization"],
  },
  {
    slug: "medical-data-transfer",
    title: "העברת מידע רפואי",
    publisher: "ppa",
    topics: ["sensitive_data", "medical"],
    moduleIds: ["db_definition", "transfer_abroad"],
  },
  {
    slug: "medical-privacy-digital-transfer",
    title: "הגנה על פרטיות מטופלים בהעברת מידע רפואי דיגיטלי",
    publisher: "ppa",
    topics: ["sensitive_data", "medical"],
    moduleIds: ["db_definition", "security_policy"],
  },
  {
    slug: "payment-transfer-privacy",
    title: "העברת כספים ואמצעי תשלום - פרטיות",
    publisher: "ppa",
    topics: ["sensitive_data", "financial"],
    moduleIds: ["db_definition"],
  },
  {
    slug: "advanced-payment-methods-privacy",
    title: "פרטיות באמצעי תשלום מתקדמים",
    publisher: "ppa",
    topics: ["sensitive_data", "financial"],
    moduleIds: ["db_definition"],
  },
  {
    slug: "workplace-cameras",
    title: "מצלמות במקום העבודה",
    publisher: "ppa",
    topics: ["surveillance"],
    moduleIds: ["db_definition", "consent_mechanism"],
  },
  {
    slug: "surveillance-cameras",
    title: "מצלמות מעקב",
    publisher: "ppa",
    topics: ["surveillance"],
    moduleIds: ["db_definition", "consent_mechanism"],
  },
  {
    slug: "surveillance-cameras-use",
    title: "שימוש במצלמות מעקב",
    publisher: "ppa",
    topics: ["surveillance"],
    moduleIds: ["db_definition", "consent_mechanism"],
  },
  {
    slug: "security-cameras-images-use",
    title: "שימוש במצלמות אבטחה ובתמונות הנקלטות",
    publisher: "ppa",
    topics: ["surveillance"],
    moduleIds: ["db_definition", "consent_mechanism"],
  },
  {
    slug: "private-affairs-information",
    title: "מידע וידיעה על ענייניו הפרטיים",
    publisher: "ppa",
    topics: ["scope"],
    moduleIds: ["privacy_policy", "db_definition"],
  },
  {
    slug: "political-parties-apps-accountability",
    title: "אחריות מפלגות בשימוש באפליקציות",
    publisher: "ppa",
    topics: ["political", "accountability"],
    moduleIds: ["db_definition", "dpa_vendors"],
  },
  {
    slug: "knesset-23-elections-refresher",
    title: "ריענון לקראת בחירות לכנסת ה-23",
    publisher: "ppa",
    topics: ["political"],
    moduleIds: ["db_definition", "consent_mechanism"],
  },
];

export function sourceUrl(slug: string): string {
  return `/legal-sources/${slug}.pdf`;
}

export function sourcesForModule(moduleId: string): LegalSource[] {
  return LEGAL_SOURCES.filter((s) => s.moduleIds.includes(moduleId));
}

export function primarySourcesForModule(moduleId: string): LegalSource[] {
  return sourcesForModule(moduleId).filter((s) => s.primary);
}
