-- CreateTable
CREATE TABLE "MealScheduleFavorite" (
    "mealScheduleEntryId" TEXT NOT NULL,
    "favoriteFoodId" TEXT NOT NULL,
    PRIMARY KEY ("mealScheduleEntryId", "favoriteFoodId"),
    CONSTRAINT "MealScheduleFavorite_mealScheduleEntryId_fkey" FOREIGN KEY ("mealScheduleEntryId") REFERENCES "MealScheduleEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MealScheduleFavorite_favoriteFoodId_fkey" FOREIGN KEY ("favoriteFoodId") REFERENCES "FavoriteFood" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "MealScheduleFavorite_favoriteFoodId_idx" ON "MealScheduleFavorite"("favoriteFoodId");
