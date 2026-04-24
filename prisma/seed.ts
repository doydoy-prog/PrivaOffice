// Prisma seed: inserts one demo non-profit organization so `npm run dev`
// shows real data immediately. Safe to re-run — checks for existing records
// before inserting.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.organization.findFirst({
    where: { name: "עמותת אחוות תורה" },
  });

  if (existing) {
    console.log("Seed: demo organization already exists, skipping.");
    return;
  }

  const org = await prisma.organization.create({
    data: {
      name: "עמותת אחוות תורה",
      type: "nonprofit",
    },
  });

  console.log(`Seed: created demo organization ${org.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
