/*
  Warnings:

  - You are about to drop the column `canAdd` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `canDelete` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `canEdit` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `canView` on the `permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permission" DROP COLUMN "canAdd",
DROP COLUMN "canDelete",
DROP COLUMN "canEdit",
DROP COLUMN "canView",
ADD COLUMN     "add" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "edit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "interface" SET DATA TYPE VARCHAR(15);
