/*
  Warnings:

  - You are about to drop the column `createdAt` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `dataPath` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `wp_session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `wp_session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session_id]` on the table `wp_session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data_path` to the `wp_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `wp_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `wp_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `wp_session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "wp_help_wpSessionId_key";

-- DropIndex
DROP INDEX "wp_session_sessionId_key";

-- AlterTable
ALTER TABLE "wp_session" DROP COLUMN "createdAt",
DROP COLUMN "dataPath",
DROP COLUMN "description",
DROP COLUMN "sessionId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_path" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wp_session_session_id_key" ON "wp_session"("session_id");
