// Wizard schema - the source of truth for the 11-step DB definition
// questionnaire. The shape of answers here must match the WizardAnswers type
// used by the document generator.

export type StepInputType =
  | "continue"
  | "text"
  | "textarea"
  | "number"
  | "options"
  | "multiSelect"
  | "vendors"
  | "manager";

export interface WizardOption<T = string | boolean> {
  value: T;
  label: string;
  icon?: "user" | "users" | "shuffle" | "globe" | "shield" | "building" | "hearts";
  sensitive?: boolean;
}

export interface HelpContent {
  title: string;
  text?: string;
  examples?: string[];
}

export interface WizardStep {
  id: string;
  bot: string; // supports <strong> and <br/>
  legalRef?: string;
  help?: HelpContent;
  input: StepInputType;
  field?: string;
  placeholder?: string;
  ctaText?: string;
  options?: WizardOption[];
  presets?: number[];
}

// 11 steps. The welcome is #1, manager is #11.
export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "welcome",
    bot: `<strong>שלום! 👋</strong> אני עמית, היועץ הדיגיטלי שלך מ-DataBee.<br/><br/>
          נעבור יחד על <strong>מסמך הגדרות מאגר המידע</strong> - זה המסמך שתקנה 2 לתקנות הגנת הפרטיות מחייבת כל ארגון שמחזיק מידע אישי להכין.<br/><br/>
          אל תדאגי - אני אסביר כל שאלה בשפה פשוטה, ובמקביל אעדכן את המסמך והדשבורד שלך בצד השמאלי.`,
    legalRef: "תקנה 2 לתקנות הגנת הפרטיות (אבטחת מידע)",
    input: "continue",
    ctaText: "יאללה, בואו נתחיל",
  },
  {
    id: "dbName",
    bot: `<strong>ראשית, איך נקרא למאגר הזה?</strong><br/><br/>
          תני שם קצר וברור שיזהה את המאגר. אם יש לך כמה מאגרים בארגון, תקנה 2 מחייבת מסמך נפרד לכל אחד.`,
    legalRef: "תקנה 2(א)",
    help: {
      title: "דוגמאות לשמות מאגרים",
      text: "השם צריך לשקף את המטרה או הקהל של המאגר.",
      examples: [
        "עובדים וספקים",
        "לקוחות ומתעניינים",
        "חברי קהילה ותורמים",
        "משתתפי אירועים",
      ],
    },
    input: "text",
    placeholder: "לדוגמה: אוהדים ומתעניינים",
    field: "dbName",
  },
  {
    id: "purpose",
    bot: `<strong>למה משמש המאגר הזה?</strong><br/><br/>
          זה נקרא "מטרת השימוש במידע" והיא קריטית - לפי <strong>עקרון צמידות המטרה</strong>, מותר להשתמש במידע רק למטרות שנקבעו ונמסרו לנושא המידע.<br/><br/>
          תארי במשפט-שניים: מה אתם עושים עם המידע הזה?`,
    legalRef: "סעיף 2(9) לחוק + תקנה 2(א)(2)",
    help: {
      title: "למה זה חשוב?",
      text: "כשנושא מידע נתן לך את הפרטים שלו, הוא הסכים שתשתמשי בהם למטרה מסוימת. שימוש במידע למטרה אחרת (למשל - איסוף לצורך הרשמה ושימוש לצרכי שיווק) ללא הסכמה נוספת הוא פגיעה בפרטיות.",
      examples: [
        "דיוור ישיר ושיווק",
        "ניהול העמותה וחברים",
        "מחקר וסטטיסטיקה",
        "גיוס תרומות",
      ],
    },
    input: "textarea",
    placeholder:
      "לדוגמה: שליחת תוכן שיווקי, ניהול אירועים, גיוס תומכים חדשים",
    field: "purpose",
  },
  {
    id: "collectionMethod",
    bot: `<strong>איך אספתם את המידע במאגר?</strong><br/><br/>
          יש שלוש דרכים מרכזיות לאסוף מידע אישי. חשוב לדעת - זה ישפיע על בסיס ההסכמה הנדרש.`,
    legalRef: "סעיפים 11-12 לחוק הגנת הפרטיות",
    input: "options",
    field: "collectionMethod",
    options: [
      {
        value: "direct",
        label: "ישירות מנושאי המידע (טפסי הרשמה, טפסים מקוונים)",
        icon: "user",
      },
      {
        value: "thirdParty",
        label: "מצדדים שלישיים (שותפים, רשימות שיווק)",
        icon: "users",
      },
      { value: "mixed", label: "שילוב של השניים", icon: "shuffle" },
    ],
  },
  {
    id: "subjectsCount",
    bot: `<strong>כמה אנשים (נושאי מידע) יש במאגר?</strong><br/><br/>
          זה מספר קריטי לקביעת רמת האבטחה: מאגרים עם מעל <strong>100,000</strong> אנשים חייבים ברמת אבטחה גבוהה לפי התוספת הראשונה.`,
    legalRef: "תוספת ראשונה לתקנות",
    help: {
      title: "איך להעריך?",
      text: "ספרי את מספר הרשומות הייחודיות במערכת הראשית שלך (CRM, Monday, אקסל). אם לא בטוחה - הערכה סבירה מספיקה, אפשר לעדכן בהמשך.",
    },
    input: "number",
    field: "subjectsCount",
    placeholder: "14200",
    presets: [50, 500, 5000, 14200, 50000, 100000],
  },
  {
    id: "permissionsCount",
    bot: `<strong>כמה עובדים/מורשים יכולים לגשת למידע הזה?</strong><br/><br/>
          גם זה פרמטר חשוב. התוספת הראשונה מגדירה שאם יש <strong>יותר מ-100 מורשי גישה</strong> - המאגר נדרש ברמת אבטחה גבוהה (עם מידע רגיש).`,
    legalRef: "תוספת ראשונה + תקנה 8",
    help: {
      title: 'מי נחשב "מורשה"?',
      text: "כל אדם שיש לו סיסמה או הרשאה לגשת למאגר - עובדים, מנהלים, אנשי IT, ספקים חיצוניים עם גישה.",
    },
    input: "number",
    field: "permissionsCount",
    placeholder: "10",
    presets: [1, 5, 10, 25, 100, 250],
  },
  {
    id: "dataTypes",
    bot: `<strong>איזה סוגי מידע יש במאגר?</strong><br/><br/>
          סמני את כל סוגי המידע שאתם שומרים. שימי לב - <strong>סוגי מידע בסימון זהב הם "מידע בעל רגישות מיוחדת"</strong> לפי תוספת ראשונה, פרט 1(3), ומשדרגים אוטומטית את רמת האבטחה.`,
    legalRef: "תוספת ראשונה, פרט 1(3) לחוק",
    input: "multiSelect",
    field: "dataTypes",
    options: [
      { value: "identity", label: "פרטי זיהוי (שם, ת״ז)", sensitive: false },
      {
        value: "contact",
        label: "פרטי קשר (טלפון, כתובת, מייל)",
        sensitive: false,
      },
      { value: "demographic", label: "דמוגרפיה (גיל, מגדר)", sensitive: false },
      { value: "occupation", label: "תחום עיסוק/תפקיד", sensitive: false },
      {
        value: "behavioral",
        label: "מידע התנהגותי (השתתפות באירועים)",
        sensitive: false,
      },
      { value: "medical", label: "מידע רפואי או נפשי", sensitive: true },
      { value: "political", label: "דעות פוליטיות", sensitive: true },
      {
        value: "religious",
        label: "אמונות דתיות או השקפת עולם",
        sensitive: true,
      },
      { value: "sexual", label: "מידע על צנעת חייו האישיים", sensitive: true },
      { value: "criminal", label: "עבר פלילי", sensitive: true },
      {
        value: "biometric",
        label: "מידע ביומטרי (שאינו תמונת פנים)",
        sensitive: true,
      },
      {
        value: "financial",
        label: "מידע על נכסים ומצב כלכלי",
        sensitive: true,
      },
      { value: "genetic", label: "מידע גנטי", sensitive: true },
      { value: "consumption", label: "הרגלי צריכה", sensitive: true },
    ],
  },
  {
    id: "subjectCategories",
    bot: `<strong>מי הם נושאי המידע במאגר?</strong><br/><br/>
          סמני את כל הקטגוריות הרלוונטיות. זה חשוב לשני דברים: <strong>(1)</strong> קביעת הבסיס המשפטי להסכמה, ו<strong>(2)</strong> זיהוי אוכלוסיות רגישות (כגון קטינים) שדורשות הגנה נוספת.`,
    legalRef: "תקנה 2(א)(3) + חוק הכשרות המשפטית והאפוטרופסות",
    help: {
      title: "למה קטינים רגישים יותר?",
      text: "איסוף מידע על ילדים מתחת לגיל 18 דורש הסכמת הורה, הסברים בשפה מותאמת, ומנגנונים נוספים למניעת ניצול. אם יש קטינים במאגר - זה ידרוש סעיף נפרד במדיניות הפרטיות.",
    },
    input: "multiSelect",
    field: "subjectCategories",
    options: [
      { value: "members", label: "חברים/תומכים", sensitive: false },
      { value: "customers", label: "לקוחות", sensitive: false },
      { value: "employees", label: "עובדי הארגון", sensitive: false },
      { value: "vendors", label: "ספקים ונותני שירות", sensitive: false },
      { value: "prospects", label: "מתעניינים", sensitive: false },
      { value: "donors", label: "תורמים", sensitive: false },
      { value: "general", label: "קהל רחב/ציבור", sensitive: false },
      {
        value: "minors",
        label: "קטינים (מתחת לגיל 18)",
        sensitive: true,
      },
    ],
  },
  {
    id: "transferAbroad",
    bot: `<strong>האם המידע נשמר או עובר מחוץ לישראל?</strong><br/><br/>
          זה כולל גם אחסון בענן של חברות זרות (Google, AWS, Azure, Monday.com). רוב הארגונים כן - וזה מחייב בסיס משפטי לפי תקנות העברת מידע לחו״ל.`,
    legalRef: 'תקנות הגנת הפרטיות (העברת מידע לחו"ל), תשס"א-2001',
    help: {
      title: "דוגמאות נפוצות",
      examples: [
        "Google Workspace (Gmail, Drive)",
        "Monday.com",
        "ActiveTrail",
        "Salesforce",
        "AWS / Azure",
      ],
    },
    input: "options",
    field: "transferAbroad",
    options: [
      { value: true, label: 'כן - יש העברה או אחסון בחו"ל', icon: "globe" },
      { value: false, label: "לא - הכל נשמר בישראל בלבד", icon: "shield" },
    ],
  },
  {
    id: "vendors",
    bot: `<strong>אילו ספקים חיצוניים מעבדים עבורכם את המידע?</strong><br/><br/>
          ספק שמקבל גישה למאגר שלכם נקרא "מחזיק" לפי התקנות, ו<strong>חייב להיחתם איתו הסכם מיקור חוץ (DPA)</strong> לפי תקנה 15. הוסיפי את כל הספקים הרלוונטיים.`,
    legalRef: "תקנה 15",
    help: {
      title: 'מי נחשב "מחזיק"?',
      text: "כל צד שלישי שיש לו גישה טכנית למידע - חברות SaaS (Monday, Salesforce), מפתחים חיצוניים, חברת אחסון בענן, מוקד טלפוני, חברת דיוור וכיו״ב.",
    },
    input: "vendors",
    field: "vendors",
  },
  {
    id: "manager",
    bot: `<strong>שלב אחרון! מי מנהל המאגר?</strong><br/><br/>
          זה האחראי על המאגר בארגון - בדרך כלל סמנכ״ל אופרציה, יועמ״ש פנימי או מנכ״ל. פרטים אלו יופיעו במסמך ומחייבים לפי התקנות.`,
    legalRef: "תקנה 2(א)(7)",
    input: "manager",
    field: "manager",
  },
];

export const TOTAL_STEPS = WIZARD_STEPS.length; // 11
