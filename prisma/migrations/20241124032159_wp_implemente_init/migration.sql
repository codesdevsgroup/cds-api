-- DropForeignKey
ALTER TABLE "wp_help" DROP CONSTRAINT "wp_help_handledByMemberId_fkey";

-- AlterTable
ALTER TABLE "wp_help" ADD COLUMN     "departmentId" INTEGER,
ADD COLUMN     "isBotHandling" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInQueue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "osId" INTEGER,
ALTER COLUMN "handledByMemberId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_handledByMemberId_fkey" FOREIGN KEY ("handledByMemberId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_osId_fkey" FOREIGN KEY ("osId") REFERENCES "os"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_help" ADD CONSTRAINT "wp_help_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
