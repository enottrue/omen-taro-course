/*
  Warnings:

  - You are about to drop the column `timecode` on the `StageTimecode` table. All the data in the column will be lost.
  - Added the required column `timeCodeEnd` to the `StageTimecode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeCodeStart` to the `StageTimecode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StageTimecode" DROP COLUMN "timecode",
ADD COLUMN     "timeCodeEnd" TEXT NOT NULL,
ADD COLUMN     "timeCodeStart" TEXT NOT NULL;
