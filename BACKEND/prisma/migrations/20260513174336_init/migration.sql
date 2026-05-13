/*
  Warnings:

  - A unique constraint covering the columns `[urlHash]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedUrl` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlHash` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_userId_fkey";

-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "normalizedUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "urlHash" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Url_urlHash_key" ON "Url"("urlHash");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
