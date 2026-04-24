-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataAsset" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT[],
    "collectionMethods" TEXT[],
    "subjectCategories" TEXT[],
    "dataTypes" TEXT[],
    "sensitiveTypes" TEXT[],
    "subjectsCount" INTEGER NOT NULL DEFAULT 0,
    "permissionsCount" INTEGER NOT NULL DEFAULT 0,
    "transferAbroad" BOOLEAN NOT NULL DEFAULT false,
    "securityLevel" TEXT NOT NULL DEFAULT 'basic',
    "managerName" TEXT,
    "managerRole" TEXT,
    "managerEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activity" TEXT,
    "hasDpa" BOOLEAN NOT NULL DEFAULT false,
    "dpaSignedAt" TIMESTAMP(3),
    "dpaExpiresAt" TIMESTAMP(3),

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataAssetVendor" (
    "dataAssetId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "DataAssetVendor_pkey" PRIMARY KEY ("dataAssetId","vendorId")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "dataAssetId" TEXT,
    "type" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "content" JSONB NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "evidence" TEXT,
    "notes" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DpoAssessment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "status" TEXT,
    "date" TIMESTAMP(3),
    "notes" TEXT,
    "autoFilled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DpoAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DpoAssessment_organizationId_questionKey_key" ON "DpoAssessment"("organizationId", "questionKey");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAsset" ADD CONSTRAINT "DataAsset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAssetVendor" ADD CONSTRAINT "DataAssetVendor_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAssetVendor" ADD CONSTRAINT "DataAssetVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DpoAssessment" ADD CONSTRAINT "DpoAssessment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
