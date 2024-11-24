/*
  Warnings:

  - You are about to drop the column `messageType` on the `whatsapp_message` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappInstanceId` on the `whatsapp_message` table. All the data in the column will be lost.
  - You are about to drop the `whatsapp_instance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teamMemberId` to the `scheduler` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wpHelpId` to the `whatsapp_message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wpMessageType` to the `whatsapp_message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WpMessageType" AS ENUM ('SENT', 'RECEIVED');

-- DropForeignKey
ALTER TABLE "invited_member" DROP CONSTRAINT "invited_member_whatsappInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_instance" DROP CONSTRAINT "whatsapp_instance_handledByMemberId_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_message" DROP CONSTRAINT "whatsapp_message_whatsappInstanceId_fkey";

-- AlterTable
ALTER TABLE "invited_member" ADD COLUMN     "wpHelpId" INTEGER;

-- AlterTable
ALTER TABLE "scheduler" ADD COLUMN     "teamMemberId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "team_members" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "whatsapp_message" DROP COLUMN "messageType",
DROP COLUMN "whatsappInstanceId",
ADD COLUMN     "wpHelpId" INTEGER NOT NULL,
ADD COLUMN     "wpMessageType" "WpMessageType" NOT NULL;

-- DropTable
DROP TABLE "whatsapp_instance";

-- DropEnum
DROP TYPE "MessageType";

-- CreateTable
CREATE TABLE "os_helper" (
    "osId" INTEGER NOT NULL,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "os_helper_pkey" PRIMARY KEY ("osId","teamMemberId")
);

-- CreateTable
CREATE TABLE "wp_help" (
    "id" SERIAL NOT NULL,
    "wpNumberId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "handledByMemberId" INTEGER NOT NULL,

    CONSTRAINT "wp_help_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wp_number" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "personId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wp_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_client_wp_number" (
    "corporateClientId" INTEGER NOT NULL,
    "wpNumberId" INTEGER NOT NULL,

    CONSTRAINT "corporate_client_wp_number_pkey" PRIMARY KEY ("corporateClientId","wpNumberId")
);

-- AddForeignKey
ALTER TABLE "os_helper" ADD CONSTRAINT "os_helper_osId_fkey" FOREIGN KEY ("osId") REFERENCES "os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "os_helper" ADD CONSTRAINT "os_helper_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_handledByMemberId_fkey" FOREIGN KEY ("handledByMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_wpNumberId_fkey" FOREIGN KEY ("wpNumberId") REFERENCES "wp_number"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpHelpId_fkey" FOREIGN KEY ("wpHelpId") REFERENCES "wp_help"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invited_member" ADD CONSTRAINT "invited_member_wpHelpId_fkey" FOREIGN KEY ("wpHelpId") REFERENCES "wp_help"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_number" ADD CONSTRAINT "wp_number_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client_wp_number" ADD CONSTRAINT "corporate_client_wp_number_corporateClientId_fkey" FOREIGN KEY ("corporateClientId") REFERENCES "corporate_client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client_wp_number" ADD CONSTRAINT "corporate_client_wp_number_wpNumberId_fkey" FOREIGN KEY ("wpNumberId") REFERENCES "wp_number"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
