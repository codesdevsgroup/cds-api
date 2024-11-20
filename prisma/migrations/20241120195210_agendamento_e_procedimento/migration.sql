/*
  Warnings:

  - You are about to drop the `procedure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "scheduler" DROP CONSTRAINT "scheduler_processId_fkey";

-- DropTable
DROP TABLE "procedure";

-- CreateTable
CREATE TABLE "processes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "returInterval" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
