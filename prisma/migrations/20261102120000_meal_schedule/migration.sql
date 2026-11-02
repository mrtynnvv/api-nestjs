-- AlterTable
ALTER TABLE "User" ADD COLUMN "mealScheduleEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MealScheduleEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "timeMinutes" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    CONSTRAINT "MealScheduleEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MealScheduleEntry_userId_timeMinutes_key" ON "MealScheduleEntry"("userId", "timeMinutes");
