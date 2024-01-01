/*
  Warnings:

  - A unique constraint covering the columns `[stageId]` on the table `StageStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StageStatus_stageId_key" ON "StageStatus"("stageId");
