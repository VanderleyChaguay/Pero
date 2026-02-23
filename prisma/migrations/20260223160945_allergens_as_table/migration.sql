/*
  Warnings:

  - You are about to drop the column `allergens` on the `MenuItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "allergens";

-- DropEnum
DROP TYPE "Allergen";

-- CreateTable
CREATE TABLE "Allergen" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameIt" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "iconUrl" TEXT,

    CONSTRAINT "Allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemAllergen" (
    "menuItemId" TEXT NOT NULL,
    "allergenId" TEXT NOT NULL,

    CONSTRAINT "MenuItemAllergen_pkey" PRIMARY KEY ("menuItemId","allergenId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Allergen_slug_key" ON "Allergen"("slug");

-- AddForeignKey
ALTER TABLE "MenuItemAllergen" ADD CONSTRAINT "MenuItemAllergen_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemAllergen" ADD CONSTRAINT "MenuItemAllergen_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
