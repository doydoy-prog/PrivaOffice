// Seed script mirroring the Phase 1 mock data.
// Run: npm run db:seed (requires DATABASE_URL to be configured first).

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DataBee dev data...");

  const org = await prisma.organization.upsert({
    where: { taxId: "580123456" },
    update: {},
    create: {
      name: "אחוות תורה",
      legalName: "אחוות תורה - עמותה רשומה",
      taxId: "580123456",
      type: "NONPROFIT",
      manager: {
        create: {
          name: "רחל כהן",
          role: "סמנכ״ל אופרציה",
          email: "rachel@achvat-tora.org.il",
        },
      },
    },
  });

  const dpoUser = await prisma.user.upsert({
    where: { email: "dpo@databee.co.il" },
    update: {},
    create: {
      clerkId: "seed_dpo_1",
      email: "dpo@databee.co.il",
      name: "עו״ד דנה לוי",
      role: "DPO",
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: "rachel@achvat-tora.org.il" },
    update: {},
    create: {
      clerkId: "seed_client_1",
      email: "rachel@achvat-tora.org.il",
      name: "רחל כהן",
      role: "CLIENT",
      organizationId: org.id,
    },
  });

  await prisma.dataAsset.create({
    data: {
      organizationId: org.id,
      name: "אוהדים ומתעניינים",
      purpose:
        "שליחת תוכן שיווקי, ניהול אירועים, גיוס תומכים חדשים והזמנות לפעילויות העמותה",
      collectionMethod: "MIXED",
      subjectsCount: 14200,
      permissionsCount: 12,
      dataTypes: ["identity", "contact", "demographic", "behavioral", "religious"],
      sensitiveTypes: ["religious"],
      hasSensitiveData: true,
      transferAbroad: true,
      securityLevel: "MEDIUM",
      status: "ACTIVE",
    },
  });

  await prisma.vendor.createMany({
    data: [
      {
        organizationId: org.id,
        name: "Google Workspace",
        activity: "דואר אלקטרוני, אחסון קבצים",
        location: "ארה״ב / EU",
        hasStandardDPA: true,
        hasDPA: true,
        dpaSignedAt: new Date("2025-01-15"),
        dpaExpiresAt: new Date("2027-01-15"),
        riskLevel: "MEDIUM",
      },
      {
        organizationId: org.id,
        name: "ActiveTrail",
        activity: "דיוור ישיר ושיווק",
        location: "ישראל",
        hasStandardDPA: false,
        hasDPA: true,
        dpaSignedAt: new Date("2024-11-03"),
        dpaExpiresAt: new Date("2026-11-03"),
        riskLevel: "HIGH",
      },
    ],
  });

  console.log({ org: org.id, dpo: dpoUser.id, client: clientUser.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
