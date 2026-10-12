-- CreateTable
CREATE TABLE "skill_operation" (
    "ownerId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_operation_pkey" PRIMARY KEY ("ownerId","operationId")
);

-- CreateIndex
CREATE INDEX "skill_operation_skillId_idx" ON "skill_operation"("skillId");

-- AddForeignKey
ALTER TABLE "skill_operation" ADD CONSTRAINT "skill_operation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_operation" ADD CONSTRAINT "skill_operation_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
