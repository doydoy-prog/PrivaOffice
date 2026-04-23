// Document generator: produces the structured content of the
// "מסמך הגדרות מאגר" per תקנה 2 לתקנות הגנת הפרטיות (אבטחת מידע).
//
// This is a template-based generator - placeholders are replaced with
// profile data. The output is both a markdown string (easy to review /
// export to docx later) and a DocumentPayload for DB persistence.
//
// NOTE per spec: we never send personal data to Claude. The AI stage
// in later phases only sees metadata (names of data types, counts, etc.),
// never the actual subject records.

import type { SecurityResult } from "./security-engine";

export interface WizardAnswers {
  dbName: string;
  purpose: string;
  collectionMethod: "direct" | "thirdParty" | "mixed";
  subjectsCount: number;
  permissionsCount: number;
  dataTypes: string[];
  sensitiveTypes: string[];
  subjectCategories: string[];
  transferAbroad: boolean;
  transferDetails?: string;
  vendors: { name: string; activity: string; location?: string }[];
  manager: { name: string; role: string; email: string };
}

export interface DocumentPayload {
  type: "db_definition";
  title: string;
  version: string;
  markdown: string;
  htmlContent: string;
  sections: Record<string, string>;
  metadata: {
    generatedAt: string;
    answers: WizardAnswers;
    security: SecurityResult;
  };
}

const DATA_TYPE_LABELS: Record<string, string> = {
  identity: "פרטי זיהוי (שם, ת״ז)",
  contact: "פרטי קשר (טלפון, כתובת, מייל)",
  demographic: "דמוגרפיה (גיל, מגדר)",
  occupation: "תחום עיסוק/תפקיד",
  behavioral: "מידע התנהגותי (השתתפות באירועים)",
  medical: "מידע רפואי או נפשי",
  political: "דעות פוליטיות",
  religious: "אמונות דתיות או השקפת עולם",
  sexual: "מידע על צנעת חייו האישיים",
  criminal: "עבר פלילי",
  biometric: "מידע ביומטרי",
  financial: "מידע על נכסים ומצב כלכלי",
  genetic: "מידע גנטי",
  consumption: "הרגלי צריכה",
};

const COLLECTION_LABELS: Record<string, string> = {
  direct: "ישירות מנושאי המידע",
  thirdParty: "מצדדים שלישיים",
  mixed: "שילוב של השניים",
};

const SUBJECT_CATEGORY_LABELS: Record<string, string> = {
  employees: "עובדי הארגון",
  customers: "לקוחות",
  members: "חברים/תומכים",
  vendors: "ספקים",
  prospects: "מתעניינים",
  donors: "תורמים",
  minors: "קטינים",
  general: "קהל רחב",
};

function renderList(items: string[]): string {
  if (!items.length) return "—";
  return items.map((i) => `- ${i}`).join("\n");
}

function renderVendors(
  vendors: WizardAnswers["vendors"],
): string {
  if (!vendors.length) return "אין ספקים חיצוניים המעבדים את המידע.";
  return vendors
    .map((v, i) => `${i + 1}. **${v.name}** — ${v.activity}${v.location ? ` (${v.location})` : ""}`)
    .join("\n");
}

export function generateDbDefinitionDocument(
  answers: WizardAnswers,
  security: SecurityResult,
  orgName: string,
): DocumentPayload {
  const now = new Date();
  const dateHe = now.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const dataTypesList = answers.dataTypes.map(
    (t) => `${DATA_TYPE_LABELS[t] || t}${answers.sensitiveTypes.includes(t) ? " **[רגיש]**" : ""}`,
  );
  const subjectCategoriesList = answers.subjectCategories.map(
    (c) => SUBJECT_CATEGORY_LABELS[c] || c,
  );

  const sections = {
    header: `# מסמך הגדרות מאגר המידע
## ${answers.dbName}

**ארגון:** ${orgName}
**תאריך הכנה:** ${dateHe}
**גרסה:** 1.0
**בסיס חוקי:** תקנה 2 לתקנות הגנת הפרטיות (אבטחת מידע), תשע״ז-2017`,

    purpose: `## 1. מטרת השימוש במידע

${answers.purpose}

**אופן איסוף המידע:** ${COLLECTION_LABELS[answers.collectionMethod]}`,

    scope: `## 2. היקף המאגר

- **מספר נושאי המידע:** ${answers.subjectsCount.toLocaleString("he-IL")}
- **מספר מורשי הגישה:** ${answers.permissionsCount}
- **קטגוריות נושאי מידע:**
${renderList(subjectCategoriesList)}`,

    dataTypes: `## 3. סוגי המידע במאגר

${renderList(dataTypesList)}

${
  answers.sensitiveTypes.length > 0
    ? `### מידע בעל רגישות מיוחדת (תוספת ראשונה, פרט 1(3)):
המאגר מכיל ${answers.sensitiveTypes.length} סוגים של מידע בעל רגישות מיוחדת, המחייבים התייחסות מיוחדת.`
    : "המאגר אינו מכיל מידע בעל רגישות מיוחדת."
}`,

    security: `## 4. סיווג רמת אבטחה

**רמה נדרשת:** ${security.levelHe}

**נימוק:** ${security.reason}

**גורמי ההכרעה:**
${renderList(security.triggers)}

**בסיס משפטי:** ${security.legalBasis}`,

    transfer: `## 5. העברת מידע לחו״ל

${
  answers.transferAbroad
    ? `המאגר כולל העברה או אחסון של מידע אישי מחוץ לישראל.
${answers.transferDetails ? `\n**פרטים:** ${answers.transferDetails}` : ""}

**בסיס משפטי:** תקנות הגנת הפרטיות (העברת מידע לחו״ל), תשס״א-2001.`
    : "המידע אינו מועבר ואינו מאוחסן מחוץ לישראל."
}`,

    vendors: `## 6. מחזיקים חיצוניים (תקנה 15)

${renderVendors(answers.vendors)}

${
  answers.vendors.length
    ? "כל ספק חייב בחתימה על הסכם מיקור חוץ (DPA) לפי תקנה 15 בטרם מתן גישה למידע."
    : ""
}`,

    manager: `## 7. מנהל המאגר

- **שם:** ${answers.manager.name}
- **תפקיד:** ${answers.manager.role}
- **אימייל:** ${answers.manager.email}`,

    footer: `---

*מסמך זה נוצר אוטומטית על ידי פלטפורמת DataBee ועבר/יעבור סקירה של יועץ פרטיות (DPO) בטרם אישורו הסופי. אין הוא מהווה חוות דעת משפטית. מומלץ לעדכן את המסמך אחת לשנה או בעת כל שינוי מהותי במאגר.*`,
  };

  const markdown = [
    sections.header,
    sections.purpose,
    sections.scope,
    sections.dataTypes,
    sections.security,
    sections.transfer,
    sections.vendors,
    sections.manager,
    sections.footer,
  ].join("\n\n");

  const htmlContent = markdownToHtml(markdown);

  return {
    type: "db_definition",
    title: `מסמך הגדרות מאגר - ${answers.dbName}`,
    version: "1.0",
    markdown,
    htmlContent,
    sections,
    metadata: {
      generatedAt: now.toISOString(),
      answers,
      security,
    },
  };
}

// Minimal markdown → HTML conversion sufficient for the generated document.
// Handles headings, bold, italic, lists, paragraphs, and horizontal rules.
// No third-party dependency — we only emit a known subset of markdown.
export function markdownToHtml(md: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  const inline = (s: string) =>
    escape(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      flushList();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      flushList();
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (line === "---") {
      flushList();
      out.push("<hr/>");
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        out.push("<ol>");
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else {
      flushList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  flushList();
  return out.join("\n");
}
