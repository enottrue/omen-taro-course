-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bitrix24ContactId" INTEGER,
ADD COLUMN     "bitrix24DealId" INTEGER,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "stripeSessionId" TEXT;
