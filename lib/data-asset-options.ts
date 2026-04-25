// Chip options for the data asset edit form.
// Mirrors prototype's SUBJECT_OPTIONS / PURPOSE_OPTIONS / COLLECTION_OPTIONS /
// DATA_TYPE_OPTIONS while exporting Hebrew labels for both the form and the
// downstream documents (privacy policy, consent banners, etc.).

export interface Option {
  value: string;
  label: string;
}

export interface DataTypeOption extends Option {
  sensitive: boolean;
}

export const SUBJECT_OPTIONS: Option[] = [
  { value: "employees", label: "עובדים" },
  { value: "suppliers", label: "ספקים" },
  { value: "customers", label: "לקוחות" },
  { value: "leads", label: "מתעניינים" },
  { value: "members", label: "חברים" },
  { value: "donors", label: "תורמים" },
  { value: "children", label: "קטינים" },
  { value: "volunteers", label: "מתנדבים" },
  { value: "public", label: "ציבור" },
];

export const PURPOSE_OPTIONS: Option[] = [
  { value: "marketing", label: "דיוור ושיווק" },
  { value: "service", label: "מתן שירות" },
  { value: "management", label: "ניהול הארגון" },
  { value: "research", label: "מחקר" },
  { value: "events", label: "אירועים" },
  { value: "fundraising", label: "גיוס תרומות" },
  { value: "recruitment", label: "גיוס עובדים" },
  { value: "hr", label: "משאבי אנוש" },
  { value: "security", label: "אבטחה" },
  { value: "legal", label: "דרישות חוק" },
  { value: "content", label: "הפצת תוכן" },
];

export const COLLECTION_OPTIONS: Option[] = [
  { value: "website", label: "אתר אינטרנט" },
  { value: "events", label: "אירועים" },
  { value: "phone", label: "טלפון" },
  { value: "whatsapp", label: "וואטסאפ" },
  { value: "social", label: "רשתות חברתיות" },
  { value: "thirdParty", label: "צדדים שלישיים" },
  { value: "cookies", label: "Cookies" },
  { value: "paper", label: "טפסים פיזיים" },
  { value: "email", label: "מייל" },
];

export const DATA_TYPE_OPTIONS: DataTypeOption[] = [
  { value: "identity", label: "פרטי זיהוי (שם, ת\"ז)", sensitive: false },
  { value: "contact", label: "פרטי קשר", sensitive: false },
  { value: "demographic", label: "דמוגרפיה", sensitive: false },
  { value: "occupation", label: "עיסוק/תפקיד", sensitive: false },
  { value: "behavioral", label: "מידע התנהגותי", sensitive: false },
  { value: "location", label: "נתוני מיקום", sensitive: true },
  { value: "medical", label: "רפואי/נפשי", sensitive: true },
  { value: "political", label: "פוליטי", sensitive: true },
  { value: "religious", label: "דתי/השקפתי", sensitive: true },
  { value: "sexual", label: "צנעת חיים", sensitive: true },
  { value: "criminal", label: "עבר פלילי", sensitive: true },
  { value: "biometric", label: "ביומטרי", sensitive: true },
  { value: "financial", label: "כלכלי", sensitive: true },
  { value: "genetic", label: "גנטי", sensitive: true },
  { value: "consumption", label: "הרגלי צריכה", sensitive: true },
];

export function dataTypeOption(value: string): DataTypeOption | undefined {
  return DATA_TYPE_OPTIONS.find((o) => o.value === value);
}
