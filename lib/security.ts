// Security level engine per Israeli Privacy Protection Regulations (Data Security), 2017.
// Levels defined in תקנות הגנת הפרטיות (אבטחת מידע) תשע"ז-2017.
// - High: sensitive data AND (>=100k subjects OR >100 authorized users)
// - Medium: sensitive data (edge case: <=10 authorized users falls back to basic)
// - Basic: default.

export type SecurityLevel = "basic" | "medium" | "high";

export interface SecurityInputs {
  sensitiveTypes: string[];
  subjectsCount: number;
  permissionsCount: number;
}

export function calculateSecurityLevel(input: SecurityInputs): SecurityLevel {
  const hasSensitive = input.sensitiveTypes.length > 0;
  const subjects = input.subjectsCount || 0;
  const permissions = input.permissionsCount || 0;

  if (hasSensitive && (subjects >= 100_000 || permissions > 100)) return "high";
  if (hasSensitive) {
    if (permissions <= 10) return "basic";
    return "medium";
  }
  return "basic";
}

export function securityLevelLabel(level: SecurityLevel): string {
  if (level === "high") return "גבוהה";
  if (level === "medium") return "בינונית";
  return "בסיסית";
}
