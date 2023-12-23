-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "lessonDescription" TEXT;

-- CreateTable
CREATE TABLE "StageTimecode" (
    "id" SERIAL NOT NULL,
    "timecode" TEXT NOT NULL,
    "stageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageTimecode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StageTimecode" ADD CONSTRAINT "StageTimecode_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
