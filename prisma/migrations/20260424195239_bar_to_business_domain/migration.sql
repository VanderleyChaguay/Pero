/*
  Warnings:

  - You are about to drop the column `barId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `barId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the `AdminBarAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bar` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "AdminBarAccess" DROP CONSTRAINT "AdminBarAccess_barId_fkey";

-- DropForeignKey
ALTER TABLE "AdminBarAccess" DROP CONSTRAINT "AdminBarAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_barId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_barId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "barId",
ADD COLUMN     "businessId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "barId",
ADD COLUMN     "businessId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AdminBarAccess";

-- DropTable
DROP TABLE "Bar";

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminBusinessAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminBusinessAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "AdminApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminBusinessAccess_userId_businessId_key" ON "AdminBusinessAccess"("userId", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminApplication_userId_businessId_key" ON "AdminApplication"("userId", "businessId");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminBusinessAccess" ADD CONSTRAINT "AdminBusinessAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminBusinessAccess" ADD CONSTRAINT "AdminBusinessAccess_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminApplication" ADD CONSTRAINT "AdminApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminApplication" ADD CONSTRAINT "AdminApplication_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
