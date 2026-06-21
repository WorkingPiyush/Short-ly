-- AlterTable
ALTER TABLE "UrlRecord" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ipHash" TEXT,
ADD COLUMN     "referrer" TEXT;

-- CreateIndex
CREATE INDEX "UrlRecord_urlId_idx" ON "UrlRecord"("urlId");

-- CreateIndex
CREATE INDEX "UrlRecord_urlId_visitedAt_idx" ON "UrlRecord"("urlId", "visitedAt");
