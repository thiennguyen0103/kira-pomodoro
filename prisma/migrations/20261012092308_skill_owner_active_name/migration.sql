-- CreateTable
CREATE TABLE "skill" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "goalHours" INTEGER NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skill_ownerId_idx" ON "skill"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_active_owner_normalized_name_key" ON "skill"("ownerId", "normalizedName") WHERE ("archivedAt" IS NULL);

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
