-- CreateTable
CREATE TABLE "ExerciseVideoCache" (
    "id" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseVideoCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseVideoCache_normalizedName_key" ON "ExerciseVideoCache"("normalizedName");

-- CreateIndex
CREATE INDEX "ExerciseVideoCache_normalizedName_idx" ON "ExerciseVideoCache"("normalizedName");

-- CreateIndex
CREATE INDEX "ExerciseVideoCache_expiresAt_idx" ON "ExerciseVideoCache"("expiresAt");
