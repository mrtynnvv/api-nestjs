/*
  Warnings:

  - You are about to drop the column `grams` on the `FavoriteFood` table. All the data in the column will be lost.
  - You are about to drop the column `grams` on the `FoodEntry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoriteFood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    CONSTRAINT "FavoriteFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteFood" ("calories", "id", "title", "userId") SELECT "calories", "id", "title", "userId" FROM "FavoriteFood";
DROP TABLE "FavoriteFood";
ALTER TABLE "new_FavoriteFood" RENAME TO "FavoriteFood";
CREATE INDEX "FavoriteFood_userId_idx" ON "FavoriteFood"("userId");
CREATE TABLE "new_FoodEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eatenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    CONSTRAINT "FoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FoodEntry" ("calories", "eatenAt", "id", "title", "userId") SELECT "calories", "eatenAt", "id", "title", "userId" FROM "FoodEntry";
DROP TABLE "FoodEntry";
ALTER TABLE "new_FoodEntry" RENAME TO "FoodEntry";
CREATE INDEX "FoodEntry_userId_eatenAt_idx" ON "FoodEntry"("userId", "eatenAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
