/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `whatsapp_message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `wp_number` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `whatsapp_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "whatsapp_message" ADD COLUMN     "messageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_message_messageId_key" ON "whatsapp_message"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "wp_number_number_key" ON "wp_number"("number");
