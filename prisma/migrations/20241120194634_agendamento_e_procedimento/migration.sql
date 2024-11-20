-- CreateTable
CREATE TABLE "scheduler" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "responsePersonId" INTEGER,
    "processId" INTEGER NOT NULL,
    "returnDay" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "notation" VARCHAR(255),
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "scheduler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure" (
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

    CONSTRAINT "procedure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_responsePersonId_fkey" FOREIGN KEY ("responsePersonId") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
