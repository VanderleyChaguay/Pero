/*
  Warnings:

  - You are about to drop the column `category` on the `Menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "category";

-- DropEnum
DROP TYPE "MenuCategory";
