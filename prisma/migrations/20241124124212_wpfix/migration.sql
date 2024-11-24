/*
  Warnings:

  - A unique constraint covering the columns `[wpSessionId]` on the table `wp_help` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wpSessionId` to the `wp_help` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "whatsapp_message" ADD COLUMN     "wpSessionId" TEXT NOT NULL DEFAULT 'default-session-id';

-- AlterTable
ALTER TABLE "wp_help" ADD COLUMN     "wpSessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wp_help_wpSessionId_key" ON "wp_help"("wpSessionId");

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_wpSessionId_fkey" FOREIGN KEY ("wpSessionId") REFERENCES "wp_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpSessionId_fkey" FOREIGN KEY ("wpSessionId") REFERENCES "wp_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
