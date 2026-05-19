-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "lastVisitedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UrlRecord" (
    "id" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "country" TEXT,
    "city" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UrlRecord" ADD CONSTRAINT "UrlRecord_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
