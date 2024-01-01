-- CreateTable
CREATE TABLE "StageStatus" (
    "id" SERIAL NOT NULL,
    "stageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StageStatus" ADD CONSTRAINT "StageStatus_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageStatus" ADD CONSTRAINT "StageStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
