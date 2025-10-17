/*
  Warnings:

  - You are about to drop the column `createdAt` on the `WeightEntry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeightEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "measuredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" REAL NOT NULL,
    CONSTRAINT "WeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WeightEntry" ("id", "measuredAt", "userId", "weight") SELECT "id", "measuredAt", "userId", "weight" FROM "WeightEntry";
DROP TABLE "WeightEntry";
ALTER TABLE "new_WeightEntry" RENAME TO "WeightEntry";
CREATE INDEX "WeightEntry_userId_measuredAt_idx" ON "WeightEntry"("userId", "measuredAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
