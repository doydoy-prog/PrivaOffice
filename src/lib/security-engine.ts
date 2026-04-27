// Security level engine based on the Israeli Privacy Protection Authority
// official guide + תקנות הגנת הפרטיות (אבטחת מידע) תשע"ז-2017, תוספת ראשונה.
//
// The classification has three levels: BASIC, MEDIUM, HIGH.
// This file is the single source of truth used by the questionnaire,
// the task generator, and the document generator.

import type { SecurityLevel } from "./types";

// Sensitive data type keys used throughout the app.
// Matches the data-types list in the wizard step.
export const SENSITIVE_TYPES = [
  "medical", // מידע רפואי או נפשי
  "political", // דעות פוליטיות
  "religious", // אמונות דתיות או השקפת עולם
  "sexual", // צנעת חייו האישיים
  "criminal", // עבר פלילי
  "biometric", // מידע ביומטרי (שאינו תמונת פנים)
  "financial", // מידע על נכסים ומצב כלכלי
  "genetic", // מידע גנטי
  "consumption", // הרגלי צריכה
] as const;

export type SensitiveType = (typeof SENSITIVE_TYPES)[number];

// "קל" סוגי מידע רגיש שמאפשרים הורדה לבסיסית בחריג של ≤10 מורשים
// ובהיקף מידע קטן. פיננסי/רפואי בסיסי/עבר פלילי - ללא קשר חמור.
const MILD_SENSITIVE: SensitiveType[] = ["financial", "criminal", "medical"];

export interface SecurityInput {
  subjectsCount: number;
  permissionsCount: number;
  sensitiveTypes: string[];
  hasOrgSubjects?: boolean; // מאגר על עובדי הארגון בלבד
  onlyInternalUse?: boolean; // רק לשימוש פנימי תפעולי
}

export interface SecurityResult {
  level: SecurityLevel;
  levelHe: string; // "בסיסית" / "בינונית" / "גבוהה"
  reason: string;
  triggers: string[]; // human-readable bullets
  legalBasis: string;
}

export function calculateSecurityLevel(input: SecurityInput): SecurityResult {
  const hasSensitive =
    input.sensitiveTypes && input.sensitiveTypes.length > 0;
  const subjects = input.subjectsCount || 0;
  const permissions = input.permissionsCount || 0;
  const triggers: string[] = [];

  // HIGH: sensitive data + (100K+ subjects OR 100+ permissions)
  if (hasSensitive && (subjects >= 100000 || permissions > 100)) {
    if (subjects >= 100000)
      triggers.push(`מאגר עם ${subjects.toLocaleString()} נושאי מידע (מעל 100,000)`);
    if (permissions > 100)
      triggers.push(`${permissions} מורשי גישה (מעל 100)`);
    triggers.push("המאגר כולל מידע בעל רגישות מיוחדת");

    return {
      level: "high",
      levelHe: "גבוהה",
      reason:
        "מידע בעל רגישות מיוחדת + (מעל 100,000 נושאי מידע או מעל 100 מורשי גישה)",
      triggers,
      legalBasis: "תוספת ראשונה לתקנות הגנת הפרטיות (אבטחת מידע)",
    };
  }

  // MEDIUM default for any sensitive data
  if (hasSensitive) {
    // Edge case: very small operation with only "mild" sensitive types
    // may drop to basic per regulatory guidance.
    const onlyMild = input.sensitiveTypes.every((t) =>
      MILD_SENSITIVE.includes(t as SensitiveType),
    );
    if (
      permissions <= 10 &&
      onlyMild &&
      subjects < 10000 &&
      (input.hasOrgSubjects || input.onlyInternalUse)
    ) {
      triggers.push("פחות מ-10 מורשי גישה");
      triggers.push("פחות מ-10,000 נושאי מידע");
      triggers.push("רק שימוש פנימי/מאגר עובדים");
      return {
        level: "basic",
        levelHe: "בסיסית",
        reason:
          "חריג: מאגר פנימי קטן (≤10 מורשים, פחות מ-10,000 נושאי מידע, רק מידע רגיש קל)",
        triggers,
        legalBasis: "תוספת ראשונה לתקנות (חריג למאגר פנימי)",
      };
    }

    triggers.push(
      `מידע בעל רגישות מיוחדת (${input.sensitiveTypes.length} סוגים)`,
    );
    if (subjects >= 10000)
      triggers.push(`${subjects.toLocaleString()} נושאי מידע`);
    if (permissions > 10) triggers.push(`${permissions} מורשי גישה`);

    return {
      level: "medium",
      levelHe: "בינונית",
      reason:
        "מאגר מכיל מידע בעל רגישות מיוחדת (ולא חל עליו תנאי הרמה הגבוהה)",
      triggers,
      legalBasis: "תוספת ראשונה לתקנות הגנת הפרטיות (אבטחת מידע)",
    };
  }

  // No sensitive data → BASIC (unless massive scale pushes to medium)
  if (subjects >= 100000 || permissions > 100) {
    triggers.push("היקף מאגר גדול");
    return {
      level: "medium",
      levelHe: "בינונית",
      reason:
        "מאגר בהיקף גדול (מעל 100,000 נושאי מידע או מעל 100 מורשים)",
      triggers,
      legalBasis: "תוספת ראשונה לתקנות",
    };
  }

  triggers.push("אין מידע בעל רגישות מיוחדת");
  triggers.push("פחות מ-100,000 נושאי מידע ו/או פחות מ-100 מורשים");
  return {
    level: "basic",
    levelHe: "בסיסית",
    reason: "מאגר רגיל ללא מידע בעל רגישות מיוחדת",
    triggers,
    legalBasis: "תוספת ראשונה לתקנות (ברירת מחדל)",
  };
}

// Separate helper: duty to notify the Authority of sensitive data
// for mass storage. Per תיקון 13.
export function requiresAuthorityNotification(input: SecurityInput): boolean {
  const hasSensitive = input.sensitiveTypes && input.sensitiveTypes.length > 0;
  return hasSensitive && input.subjectsCount >= 100000;
}

// After תיקון 13 (effective Aug 2025): registration required only for
// public bodies + commercial data trading + direct-mail data brokers.
// Typical client (nonprofit/SME) is exempt.
export interface RegistrationInput {
  orgType: "nonprofit" | "company" | "public_body" | "association";
  purposeIncludesDataTrading?: boolean;
  purposeIncludesDirectMailBroker?: boolean;
}

export function requiresRegistration(input: RegistrationInput): boolean {
  if (input.orgType === "public_body") return true;
  if (input.purposeIncludesDataTrading) return true;
  if (input.purposeIncludesDirectMailBroker) return true;
  return false;
}
