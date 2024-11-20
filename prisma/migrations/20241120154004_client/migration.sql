/*
  Warnings:

  - You are about to drop the column `defaulter` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `client` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `client` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(80)`.
  - You are about to alter the column `fantasyName` on the `client` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(80)`.

*/
-- AlterTable
ALTER TABLE "client" DROP COLUMN "defaulter",
DROP COLUMN "photo",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(80),
ALTER COLUMN "fantasyName" SET DATA TYPE VARCHAR(80);
