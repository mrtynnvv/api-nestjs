-- CreateTable
CREATE TABLE "FavoriteFood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "grams" INTEGER NOT NULL,
    CONSTRAINT "FavoriteFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FavoriteFood_userId_idx" ON "FavoriteFood"("userId");
