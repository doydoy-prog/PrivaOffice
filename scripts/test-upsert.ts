// Smoke test for the data-asset persistence layer. Calls Prisma directly
// (the server action wraps this with revalidatePath which only works inside
// a Next.js request).

import { prisma } from "../lib/prisma";
import { calculateSecurityLevel } from "../lib/security";

async function main() {
  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("no org");

  const sensitiveTypes = ["religious", "financial"];
  const securityLevel = calculateSecurityLevel({
    sensitiveTypes,
    subjectsCount: 250000,
    permissionsCount: 25,
  });

  const existing = await prisma.dataAsset.findFirst({
    where: { organizationId: org.id },
  });

  const data = {
    name: "אוהדים ומתעניינים",
    subjectsCount: 250000,
    permissionsCount: 25,
    transferAbroad: true,
    subjectCategories: ["customers", "donors", "members"],
    purpose: ["marketing", "fundraising", "events"],
    collectionMethods: ["website", "events", "email"],
    dataTypes: ["identity", "contact", "demographic", "religious", "financial"],
    sensitiveTypes,
    managerName: "ישראל ישראלי",
    managerRole: "סמנכ\"ל תפעול",
    managerEmail: "israel@example.org.il",
    securityLevel,
  };

  const asset = existing
    ? await prisma.dataAsset.update({ where: { id: existing.id }, data })
    : await prisma.dataAsset.create({ data: { ...data, organizationId: org.id } });

  await prisma.dataAssetVendor.deleteMany({ where: { dataAssetId: asset.id } });
  await prisma.vendor.deleteMany({ where: { organizationId: org.id } });

  for (const v of [
    { name: "Mailchimp", activity: "דיוור" },
    { name: "Zapier", activity: "אוטומציה" },
  ]) {
    const vendor = await prisma.vendor.create({
      data: { organizationId: org.id, name: v.name, activity: v.activity },
    });
    await prisma.dataAssetVendor.create({
      data: { dataAssetId: asset.id, vendorId: vendor.id },
    });
  }

  const refreshed = await prisma.dataAsset.findUnique({
    where: { id: asset.id },
    include: { vendors: { include: { vendor: true } } },
  });

  console.log("asset:", refreshed?.name, "level:", refreshed?.securityLevel);
  console.log(
    "vendors:",
    refreshed?.vendors.map((v) => v.vendor.name).join(", "),
  );
  console.log("expected level for sensitive + 250k subjects: high");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
