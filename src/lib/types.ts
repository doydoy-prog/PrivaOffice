// Domain types used across the UI. These mirror the Prisma schema but are
// kept in plain TS so pages can consume mock data before the DB is connected.

export type SecurityLevel = "basic" | "medium" | "high";
export type DocStatus =
  | "draft_ai"
  | "under_review"
  | "needs_edit"
  | "approved"
  | "published";
export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "awaiting_dpo"
  | "needs_edit"
  | "completed"
  | "skipped";
export type Priority = "high" | "medium" | "low";

export type TaskType =
  | "privacy_policy"
  | "consent_mechanisms"
  | "dsr_mechanism"
  | "unsubscribe"
  | "dpa_vendors"
  | "transfer_abroad"
  | "security_procedure"
  | "logging"
  | "training"
  | "system_mapping"
  | "annual_review"
  | "audits"
  | "data_minimization"
  | "penetration_test"
  | "dpo_appointment";

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  type: "nonprofit" | "company" | "public_body" | "association";
  manager: {
    name: string;
    role: string;
    email: string;
  };
}

export interface DataAsset {
  id: string;
  name: string;
  purpose: string;
  subjectsCount: number;
  permissionsCount: number;
  dataTypes: string[];
  sensitiveTypes: string[];
  hasSensitiveData: boolean;
  transferAbroad: boolean;
  securityLevel: SecurityLevel;
  status: "draft" | "active" | "archived";
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  activity: string;
  location: string;
  hasStandardDPA: boolean;
  hasDPA: boolean;
  dpaSignedAt?: string;
  dpaExpiresAt?: string;
  riskLevel: "low" | "medium" | "high";
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  legalReference: string;
  module: "deep" | "simple";
}

export interface Document {
  id: string;
  type: string;
  title: string;
  version: string;
  status: DocStatus;
  generatedAt: string;
  approvedAt?: string;
}

export interface ComplianceSnapshot {
  score: number; // 0-100
  completedTasks: number;
  totalTasks: number;
  approvedDocs: number;
  pendingDpoReview: number;
  highPriorityOpen: number;
  nextDueDate?: string;
}
