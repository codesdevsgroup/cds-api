/*
  Warnings:

  - You are about to drop the `wp_number_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wp_number_session" DROP CONSTRAINT "wp_number_session_wpNumberId_fkey";

-- DropForeignKey
ALTER TABLE "wp_number_session" DROP CONSTRAINT "wp_number_session_wpSessionNumber_fkey";

-- AlterTable
ALTER TABLE "wp_number" ADD COLUMN     "wpSessions" TEXT;

-- DropTable
DROP TABLE "wp_number_session";
