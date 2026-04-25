import { prisma } from "../lib/prisma";
import { TASKS } from "../lib/tasks";

async function main() {
  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("no org");
  const before = await prisma.task.count({ where: { organizationId: org.id } });

  // Inline ensureOrganizationTasks (action wrapper requires Next request scope)
  const existing = await prisma.task.findMany({
    where: { organizationId: org.id },
    select: { taskType: true },
  });
  const have = new Set(existing.map((e) => e.taskType));
  const missing = TASKS.filter((t) => !have.has(t.id));
  if (missing.length) {
    await prisma.task.createMany({
      data: missing.map((t) => ({
        organizationId: org.id,
        taskType: t.id,
        status: "open",
      })),
    });
  }

  const after = await prisma.task.count({ where: { organizationId: org.id } });

  // Mark a couple done
  await prisma.task.update({
    where: { id: (await prisma.task.findFirstOrThrow({
      where: { organizationId: org.id, taskType: "privacy_policy" },
    })).id },
    data: { status: "done", completedAt: new Date() },
  });

  const done = await prisma.task.count({
    where: { organizationId: org.id, status: "done" },
  });

  console.log(`tasks before: ${before}, after ensure: ${after} (expect 16), done: ${done}`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
