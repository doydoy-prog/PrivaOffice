"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { calculateSecurityLevel } from "@/lib/security";
import {
  COLLECTION_OPTIONS,
  DATA_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  SUBJECT_OPTIONS,
} from "@/lib/data-asset-options";

const SUBJECT_VALUES = new Set(SUBJECT_OPTIONS.map((o) => o.value));
const PURPOSE_VALUES = new Set(PURPOSE_OPTIONS.map((o) => o.value));
const COLLECTION_VALUES = new Set(COLLECTION_OPTIONS.map((o) => o.value));
const DATA_TYPE_VALUES = new Set(DATA_TYPE_OPTIONS.map((o) => o.value));
const SENSITIVE_VALUES = new Set(
  DATA_TYPE_OPTIONS.filter((o) => o.sensitive).map((o) => o.value),
);

export interface VendorInput {
  id?: string;
  name: string;
  activity: string;
}

export interface DataAssetInput {
  name: string;
  subjectsCount: number;
  permissionsCount: number;
  transferAbroad: boolean;
  subjectCategories: string[];
  purpose: string[];
  collectionMethods: string[];
  dataTypes: string[];
  managerName: string;
  managerRole: string;
  managerEmail: string;
  vendors: VendorInput[];
}

export interface DataAssetState extends DataAssetInput {
  id: string | null;
  securityLevel: "basic" | "medium" | "high";
}

function emptyState(): DataAssetState {
  return {
    id: null,
    name: "",
    subjectsCount: 0,
    permissionsCount: 0,
    transferAbroad: false,
    subjectCategories: [],
    purpose: [],
    collectionMethods: [],
    dataTypes: [],
    managerName: "",
    managerRole: "",
    managerEmail: "",
    vendors: [],
    securityLevel: "basic",
  };
}

export async function getDataAssetState(orgId: string): Promise<DataAssetState> {
  const asset = await prisma.dataAsset.findFirst({
    where: { organizationId: orgId },
    orderBy: { createdAt: "asc" },
    include: { vendors: { include: { vendor: true } } },
  });
  if (!asset) return emptyState();
  return {
    id: asset.id,
    name: asset.name,
    subjectsCount: asset.subjectsCount,
    permissionsCount: asset.permissionsCount,
    transferAbroad: asset.transferAbroad,
    subjectCategories: asset.subjectCategories,
    purpose: asset.purpose,
    collectionMethods: asset.collectionMethods,
    dataTypes: asset.dataTypes,
    managerName: asset.managerName ?? "",
    managerRole: asset.managerRole ?? "",
    managerEmail: asset.managerEmail ?? "",
    vendors: asset.vendors.map((dav) => ({
      id: dav.vendor.id,
      name: dav.vendor.name,
      activity: dav.vendor.activity ?? "",
    })),
    securityLevel: asset.securityLevel as "basic" | "medium" | "high",
  };
}

function sanitizeStringArray(input: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of input) {
    if (typeof v === "string" && allowed.has(v) && !seen.has(v)) {
      seen.add(v);
      result.push(v);
    }
  }
  return result;
}

export interface UpsertResult {
  ok: boolean;
  id?: string;
  error?: string;
  securityLevel?: "basic" | "medium" | "high";
}

export async function upsertDataAsset(
  orgId: string,
  raw: DataAssetInput,
): Promise<UpsertResult> {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) return { ok: false, error: "ארגון לא נמצא" };

  const name = raw.name.trim();
  if (!name) return { ok: false, error: "יש להזין שם מאגר" };

  const subjectCategories = sanitizeStringArray(raw.subjectCategories, SUBJECT_VALUES);
  const purpose = sanitizeStringArray(raw.purpose, PURPOSE_VALUES);
  const collectionMethods = sanitizeStringArray(raw.collectionMethods, COLLECTION_VALUES);
  const dataTypes = sanitizeStringArray(raw.dataTypes, DATA_TYPE_VALUES);
  const sensitiveTypes = dataTypes.filter((v) => SENSITIVE_VALUES.has(v));

  const subjectsCount = Math.max(0, Math.floor(Number(raw.subjectsCount) || 0));
  const permissionsCount = Math.max(0, Math.floor(Number(raw.permissionsCount) || 0));

  const securityLevel = calculateSecurityLevel({
    sensitiveTypes,
    subjectsCount,
    permissionsCount,
  });

  const baseData = {
    name,
    subjectsCount,
    permissionsCount,
    transferAbroad: !!raw.transferAbroad,
    subjectCategories,
    purpose,
    collectionMethods,
    dataTypes,
    sensitiveTypes,
    managerName: raw.managerName.trim() || null,
    managerRole: raw.managerRole.trim() || null,
    managerEmail: raw.managerEmail.trim() || null,
    securityLevel,
  };

  const existing = await prisma.dataAsset.findFirst({
    where: { organizationId: orgId },
    orderBy: { createdAt: "asc" },
  });

  const asset = existing
    ? await prisma.dataAsset.update({
        where: { id: existing.id },
        data: baseData,
      })
    : await prisma.dataAsset.create({
        data: { ...baseData, organizationId: orgId },
      });

  // Vendor sync: replace-all approach. Vendors are scoped to the organization
  // but at this stage of the product they're only referenced via this form,
  // so a clean rebuild keeps the code simple. When DPA tracking lands the
  // sync becomes diff-based.
  await prisma.dataAssetVendor.deleteMany({ where: { dataAssetId: asset.id } });
  await prisma.vendor.deleteMany({ where: { organizationId: orgId } });

  const cleanVendors = raw.vendors
    .map((v) => ({ name: v.name.trim(), activity: v.activity.trim() }))
    .filter((v) => v.name.length > 0);

  for (const v of cleanVendors) {
    const created = await prisma.vendor.create({
      data: {
        organizationId: orgId,
        name: v.name,
        activity: v.activity || null,
      },
    });
    await prisma.dataAssetVendor.create({
      data: { dataAssetId: asset.id, vendorId: created.id },
    });
  }

  revalidatePath("/");
  revalidatePath(`/${orgId}`);
  revalidatePath(`/${orgId}/data-asset`);

  return { ok: true, id: asset.id, securityLevel };
}
