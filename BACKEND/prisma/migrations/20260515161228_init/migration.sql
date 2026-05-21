/*
  Warnings:

  - You are about to drop the column `shortcode` on the `Url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortCode]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortCode` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Url_shortcode_key";

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "shortcode",
ADD COLUMN     "shortCode" TEXT NOT NULL,
ADD COLUMN     "tempId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortCode_key" ON "Url"("shortCode");

-- CreateIndex
CREATE INDEX "Url_tempId_idx" ON "Url"("tempId");

-- CreateIndex
CREATE INDEX "Url_shortCode_idx" ON "Url"("shortCode");
