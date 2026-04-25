"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TASKS } from "@/lib/tasks";

export type TaskStatus = "open" | "in_progress" | "done";

const VALID_STATUSES: TaskStatus[] = ["open", "in_progress", "done"];
const VALID_TASK_TYPES = new Set(TASKS.map((t) => t.id));

// Ensures every TASKS entry has a row for the given organization. Idempotent —
// safe to call from createOrganization, upsertDataAsset, etc. Tasks default to
// status "open"; existing rows are left untouched.
export async function ensureOrganizationTasks(orgId: string): Promise<void> {
  const existing = await prisma.task.findMany({
    where: { organizationId: orgId },
    select: { taskType: true },
  });
  const have = new Set(existing.map((e) => e.taskType));
  const missing = TASKS.filter((t) => !have.has(t.id));
  if (missing.length === 0) return;

  await prisma.task.createMany({
    data: missing.map((t) => ({
      organizationId: orgId,
      taskType: t.id,
      status: "open",
    })),
  });
}

export interface SetTaskStatusResult {
  ok: boolean;
  status?: TaskStatus;
  error?: string;
}

export async function setTaskStatus(
  orgId: string,
  taskType: string,
  status: TaskStatus,
): Promise<SetTaskStatusResult> {
  if (!VALID_TASK_TYPES.has(taskType)) {
    return { ok: false, error: "סוג משימה לא תקין" };
  }
  if (!VALID_STATUSES.includes(status)) {
    return { ok: false, error: "סטטוס לא תקין" };
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true },
  });
  if (!org) return { ok: false, error: "ארגון לא נמצא" };

  const existing = await prisma.task.findFirst({
    where: { organizationId: orgId, taskType },
    select: { id: true },
  });

  const completedAt = status === "done" ? new Date() : null;

  if (existing) {
    await prisma.task.update({
      where: { id: existing.id },
      data: { status, completedAt },
    });
  } else {
    await prisma.task.create({
      data: { organizationId: orgId, taskType, status, completedAt },
    });
  }

  revalidatePath("/");
  revalidatePath(`/${orgId}`);
  revalidatePath(`/${orgId}/module/${taskType}`);

  return { ok: true, status };
}

export async function getTaskStatus(
  orgId: string,
  taskType: string,
): Promise<TaskStatus> {
  const t = await prisma.task.findFirst({
    where: { organizationId: orgId, taskType },
    select: { status: true },
  });
  return (t?.status as TaskStatus | undefined) ?? "open";
}
