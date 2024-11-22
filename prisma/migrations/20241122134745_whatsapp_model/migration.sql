/*
  Warnings:

  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teamMembersId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('SENT', 'RECEIVED');

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_addressId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "teamMembersId" INTEGER;

-- DropTable
DROP TABLE "client";

-- CreateTable
CREATE TABLE "team_members" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "workStartTime" TIMESTAMP(3) NOT NULL,
    "workEndTime" TIMESTAMP(3) NOT NULL,
    "discountLimit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" VARCHAR(100) NOT NULL,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member_department" (
    "teamMemberId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "team_member_department_pkey" PRIMARY KEY ("teamMemberId","departmentId")
);

-- CreateTable
CREATE TABLE "os" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "personId" INTEGER NOT NULL,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "os_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_instance" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "handledByMemberId" INTEGER NOT NULL,

    CONSTRAINT "whatsapp_instance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_message" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "osId" INTEGER NOT NULL,
    "messageType" "MessageType" NOT NULL,
    "whatsappInstanceId" INTEGER,

    CONSTRAINT "whatsapp_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invited_member" (
    "whatsappInstanceId" INTEGER NOT NULL,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "invited_member_pkey" PRIMARY KEY ("whatsappInstanceId","teamMemberId")
);

-- CreateTable
CREATE TABLE "corporate_client" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "fantasyName" VARCHAR(80),
    "cpfCnpj" VARCHAR(14),
    "email" VARCHAR(80) NOT NULL,
    "phone1" VARCHAR(20),
    "phone2" VARCHAR(20),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addressId" INTEGER,

    CONSTRAINT "corporate_client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "corporate_client_email_key" ON "corporate_client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_client_addressId_key" ON "corporate_client"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "user_teamMembersId_key" ON "user"("teamMembersId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_teamMembersId_fkey" FOREIGN KEY ("teamMembersId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_department" ADD CONSTRAINT "team_member_department_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_department" ADD CONSTRAINT "team_member_department_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "os" ADD CONSTRAINT "os_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "os" ADD CONSTRAINT "os_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_instance" ADD CONSTRAINT "whatsapp_instance_handledByMemberId_fkey" FOREIGN KEY ("handledByMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_osId_fkey" FOREIGN KEY ("osId") REFERENCES "os"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_whatsappInstanceId_fkey" FOREIGN KEY ("whatsappInstanceId") REFERENCES "whatsapp_instance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invited_member" ADD CONSTRAINT "invited_member_whatsappInstanceId_fkey" FOREIGN KEY ("whatsappInstanceId") REFERENCES "whatsapp_instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invited_member" ADD CONSTRAINT "invited_member_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client" ADD CONSTRAINT "corporate_client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client" ADD CONSTRAINT "corporate_client_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
