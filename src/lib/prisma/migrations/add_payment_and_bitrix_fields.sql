-- Добавляем новые поля в таблицу User
ALTER TABLE "User" ADD COLUMN "isPaid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "bitrix24ContactId" INTEGER;
ALTER TABLE "User" ADD COLUMN "bitrix24DealId" INTEGER; 