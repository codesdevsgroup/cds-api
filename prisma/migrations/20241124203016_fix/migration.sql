-- AlterTable
ALTER TABLE "whatsapp_message" ADD COLUMN     "wpNumberId" INTEGER;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpNumberId_fkey" FOREIGN KEY ("wpNumberId") REFERENCES "wp_number"("id") ON DELETE SET NULL ON UPDATE CASCADE;
