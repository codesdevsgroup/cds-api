-- CreateEnum
CREATE TYPE "WpSessionStatus" AS ENUM ('PENDING', 'CONNECTED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "WpMessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "WpMessageDirection" AS ENUM ('SENT', 'RECEIVED');

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "phone1" VARCHAR(20),
    "phone2" VARCHAR(20),
    "place" VARCHAR(150) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(50),
    "neighborhood" VARCHAR(120) NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zipCode" VARCHAR(10) NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "cpfCnpj" VARCHAR(14),
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "termsIp" VARCHAR(45),
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "personId" INTEGER,
    "teamMembersId" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "interface" VARCHAR(14) NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canAdd" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "fantasyName" VARCHAR(255),
    "cpfCnpj" VARCHAR(11),
    "email" VARCHAR(80) NOT NULL,
    "phone1" VARCHAR(20),
    "phone2" VARCHAR(20),
    "birthDate" TIMESTAMP(3),
    "notes" TEXT,
    "defaulter" BOOLEAN NOT NULL DEFAULT false,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addressId" INTEGER,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(120) NOT NULL,
    "complement" VARCHAR(30),
    "number" VARCHAR(10) NOT NULL,
    "neighborhood" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zipCode" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "os_helper" (
    "osId" INTEGER NOT NULL,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "os_helper_pkey" PRIMARY KEY ("osId","teamMemberId")
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

-- CreateTable
CREATE TABLE "wp_session" (
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "WpSessionStatus" NOT NULL,
    "qrCode" TEXT,
    "sessionData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "wp_session_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "wp_help" (
    "id" SERIAL NOT NULL,
    "wpNumberId" INTEGER NOT NULL,
    "wpSessionNumber" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "handledByMemberId" INTEGER,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "osId" INTEGER,
    "isBotHandling" BOOLEAN NOT NULL DEFAULT false,
    "isInQueue" BOOLEAN NOT NULL DEFAULT false,
    "departmentId" INTEGER,

    CONSTRAINT "wp_help_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_message" (
    "id" SERIAL NOT NULL,
    "messageId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "osId" INTEGER,
    "wpHelpId" INTEGER,
    "wpSessionNumber" TEXT NOT NULL,
    "readStatus" BOOLEAN NOT NULL DEFAULT false,
    "responseTime" INTEGER,
    "status" "WpMessageStatus" NOT NULL,
    "direction" "WpMessageDirection" NOT NULL,
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "wpNumberId" INTEGER,

    CONSTRAINT "whatsapp_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invited_member" (
    "whatsappInstanceNumber" TEXT NOT NULL,
    "teamMemberId" INTEGER NOT NULL,
    "wpHelpId" INTEGER,

    CONSTRAINT "invited_member_pkey" PRIMARY KEY ("whatsappInstanceNumber","teamMemberId")
);

-- CreateTable
CREATE TABLE "wp_number" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "personId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wpSessions" TEXT,

    CONSTRAINT "wp_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_client_wp_number" (
    "corporateClientId" INTEGER NOT NULL,
    "wpNumberId" INTEGER NOT NULL,

    CONSTRAINT "corporate_client_wp_number_pkey" PRIMARY KEY ("corporateClientId","wpNumberId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_personId_key" ON "user"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "user_teamMembersId_key" ON "user"("teamMembersId");

-- CreateIndex
CREATE UNIQUE INDEX "permission_userId_interface_key" ON "permission"("userId", "interface");

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "person_addressId_key" ON "person"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_client_email_key" ON "corporate_client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_client_addressId_key" ON "corporate_client"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_message_messageId_key" ON "whatsapp_message"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "wp_number_number_key" ON "wp_number"("number");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_teamMembersId_fkey" FOREIGN KEY ("teamMembersId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_department" ADD CONSTRAINT "team_member_department_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_department" ADD CONSTRAINT "team_member_department_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "os" ADD CONSTRAINT "os_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "os" ADD CONSTRAINT "os_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "os_helper" ADD CONSTRAINT "os_helper_osId_fkey" FOREIGN KEY ("osId") REFERENCES "os"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "os_helper" ADD CONSTRAINT "os_helper_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client" ADD CONSTRAINT "corporate_client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client" ADD CONSTRAINT "corporate_client_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_handledByMemberId_fkey" FOREIGN KEY ("handledByMemberId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_wpNumberId_fkey" FOREIGN KEY ("wpNumberId") REFERENCES "wp_number"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_osId_fkey" FOREIGN KEY ("osId") REFERENCES "os"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_wpSessionNumber_fkey" FOREIGN KEY ("wpSessionNumber") REFERENCES "wp_session"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_osId_fkey" FOREIGN KEY ("osId") REFERENCES "os"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpHelpId_fkey" FOREIGN KEY ("wpHelpId") REFERENCES "wp_help"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpSessionNumber_fkey" FOREIGN KEY ("wpSessionNumber") REFERENCES "wp_session"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_wpNumberId_fkey" FOREIGN KEY ("wpNumberId") REFERENCES "wp_number"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invited_member" ADD CONSTRAINT "invited_member_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invited_member" ADD CONSTRAINT "invited_member_wpHelpId_fkey" FOREIGN KEY ("wpHelpId") REFERENCES "wp_help"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invited_member" ADD CONSTRAINT "invited_member_whatsappInstanceNumber_fkey" FOREIGN KEY ("whatsappInstanceNumber") REFERENCES "wp_session"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_number" ADD CONSTRAINT "wp_number_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client_wp_number" ADD CONSTRAINT "corporate_client_wp_number_corporateClientId_fkey" FOREIGN KEY ("corporateClientId") REFERENCES "corporate_client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_client_wp_number" ADD CONSTRAINT "corporate_client_wp_number_wpNumberId_fkey" FOREIGN KEY ("wpNumberId") REFERENCES "wp_number"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
