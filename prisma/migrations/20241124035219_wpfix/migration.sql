-- DropForeignKey
ALTER TABLE "whatsapp_message" DROP CONSTRAINT "whatsapp_message_wpHelpId_fkey";

-- AlterTable
ALTER TABLE "whatsapp_message" ALTER COLUMN "wpHelpId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpHelpId_fkey" FOREIGN KEY ("wpHelpId") REFERENCES "wp_help"("id") ON DELETE SET NULL ON UPDATE CASCADE;
