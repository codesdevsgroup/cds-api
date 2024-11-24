/*
  Warnings:

  - The primary key for the `invited_member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `whatsappInstanceId` on the `invited_member` table. All the data in the column will be lost.
  - You are about to drop the column `wpSessionId` on the `whatsapp_message` table. All the data in the column will be lost.
  - You are about to drop the column `wpSessionId` on the `wp_help` table. All the data in the column will be lost.
  - The primary key for the `wp_session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `data_path` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `wp_session` table. All the data in the column will be lost.
  - Added the required column `whatsappInstanceNumber` to the `invited_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wpSessionNumber` to the `whatsapp_message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wpSessionNumber` to the `wp_help` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `wp_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `wp_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `wp_session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "whatsapp_message" DROP CONSTRAINT "whatsapp_message_wpSessionId_fkey";

-- DropForeignKey
ALTER TABLE "wp_help" DROP CONSTRAINT "wp_help_wpSessionId_fkey";

-- DropIndex
DROP INDEX "wp_session_session_id_key";

-- AlterTable
ALTER TABLE "invited_member" DROP CONSTRAINT "invited_member_pkey",
DROP COLUMN "whatsappInstanceId",
ADD COLUMN     "whatsappInstanceNumber" TEXT NOT NULL,
ADD CONSTRAINT "invited_member_pkey" PRIMARY KEY ("whatsappInstanceNumber", "teamMemberId");

-- AlterTable
ALTER TABLE "whatsapp_message" DROP COLUMN "wpSessionId",
ADD COLUMN     "wpSessionNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wp_help" DROP COLUMN "wpSessionId",
ADD COLUMN     "wpSessionNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wp_session" DROP CONSTRAINT "wp_session_pkey",
DROP COLUMN "created_at",
DROP COLUMN "data_path",
DROP COLUMN "id",
DROP COLUMN "session_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "sessionData" JSONB,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "wp_session_pkey" PRIMARY KEY ("number");

-- CreateTable
CREATE TABLE "wp_number_session" (
    "wpNumberId" INTEGER NOT NULL,
    "wpSessionNumber" TEXT NOT NULL,

    CONSTRAINT "wp_number_session_pkey" PRIMARY KEY ("wpNumberId","wpSessionNumber")
);

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_wpSessionNumber_fkey" FOREIGN KEY ("wpSessionNumber") REFERENCES "wp_session"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpSessionNumber_fkey" FOREIGN KEY ("wpSessionNumber") REFERENCES "wp_session"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invited_member" ADD CONSTRAINT "invited_member_whatsappInstanceNumber_fkey" FOREIGN KEY ("whatsappInstanceNumber") REFERENCES "wp_session"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_number_session" ADD CONSTRAINT "wp_number_session_wpNumberId_fkey" FOREIGN KEY ("wpNumberId") REFERENCES "wp_number"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_number_session" ADD CONSTRAINT "wp_number_session_wpSessionNumber_fkey" FOREIGN KEY ("wpSessionNumber") REFERENCES "wp_session"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
