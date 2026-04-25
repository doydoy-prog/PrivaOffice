"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { OrganizationType } from "@/lib/types";

const VALID_TYPES: OrganizationType[] = ["nonprofit", "company", "public"];

export interface OrganizationListItem {
  id: string;
  name: string;
  type: OrganizationType;
  createdAt: string;
  dataAssetName: string | null;
  tasksDone: number;
  tasksTotal: number;
}

export async function listOrganizations(): Promise<OrganizationListItem[]> {
  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      dataAssets: { orderBy: { createdAt: "asc" }, take: 1 },
      tasks: true,
    },
  });

  return orgs.map((org) => ({
    id: org.id,
    name: org.name,
    type: org.type as OrganizationType,
    createdAt: org.createdAt.toISOString(),
    dataAssetName: org.dataAssets[0]?.name ?? null,
    tasksDone: org.tasks.filter((t) => t.status === "done").length,
    tasksTotal: org.tasks.length,
  }));
}

export interface CreateOrganizationResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function createOrganization(formData: FormData): Promise<CreateOrganizationResult> {
  const rawName = formData.get("name");
  const rawType = formData.get("type");

  const name = typeof rawName === "string" ? rawName.trim() : "";
  const type = typeof rawType === "string" ? rawType : "";

  if (!name) return { ok: false, error: "יש להזין שם ארגון" };
  if (!VALID_TYPES.includes(type as OrganizationType)) {
    return { ok: false, error: "סוג הארגון אינו תקין" };
  }

  const org = await prisma.organization.create({
    data: { name, type },
  });

  revalidatePath("/");
  return { ok: true, id: org.id };
}

export interface OrganizationDashboard {
  id: string;
  name: string;
  type: OrganizationType;
  dataAsset: {
    id: string;
    name: string;
    subjectsCount: number;
    permissionsCount: number;
    dataTypes: string[];
    sensitiveTypes: string[];
    securityLevel: string;
    vendors: { name: string; activity: string | null }[];
  } | null;
  taskStatuses: Record<string, "open" | "in_progress" | "done">;
}

export async function getOrganizationDashboard(
  id: string,
): Promise<OrganizationDashboard | null> {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      dataAssets: {
        orderBy: { createdAt: "asc" },
        take: 1,
        include: {
          vendors: { include: { vendor: true } },
        },
      },
      tasks: true,
    },
  });
  if (!org) return null;

  const taskStatuses: Record<string, "open" | "in_progress" | "done"> = {};
  for (const t of org.tasks) {
    taskStatuses[t.taskType] = t.status as "open" | "in_progress" | "done";
  }

  const primary = org.dataAssets[0] ?? null;

  return {
    id: org.id,
    name: org.name,
    type: org.type as OrganizationType,
    dataAsset: primary
      ? {
          id: primary.id,
          name: primary.name,
          subjectsCount: primary.subjectsCount,
          permissionsCount: primary.permissionsCount,
          dataTypes: primary.dataTypes,
          sensitiveTypes: primary.sensitiveTypes,
          securityLevel: primary.securityLevel,
          vendors: primary.vendors.map((v) => ({
            name: v.vendor.name,
            activity: v.vendor.activity,
          })),
        }
      : null,
    taskStatuses,
  };
}

export async function deleteOrganization(id: string): Promise<void> {
  // Cascade manually: Prisma schema does not declare onDelete cascades, so we
  // remove dependents explicitly to avoid FK violations.
  await prisma.$transaction([
    prisma.dpoAssessment.deleteMany({ where: { organizationId: id } }),
    prisma.task.deleteMany({ where: { organizationId: id } }),
    prisma.document.deleteMany({ where: { organizationId: id } }),
    prisma.dataAssetVendor.deleteMany({
      where: { dataAsset: { organizationId: id } },
    }),
    prisma.dataAsset.deleteMany({ where: { organizationId: id } }),
    prisma.vendor.deleteMany({ where: { organizationId: id } }),
    prisma.user.updateMany({
      where: { organizationId: id },
      data: { organizationId: null },
    }),
    prisma.organization.delete({ where: { id } }),
  ]);
  revalidatePath("/");
}
