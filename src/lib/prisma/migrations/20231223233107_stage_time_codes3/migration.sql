/*
  Warnings:

  - Added the required column `name` to the `StageTimecode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StageTimecode" ADD COLUMN     "name" TEXT NOT NULL;
