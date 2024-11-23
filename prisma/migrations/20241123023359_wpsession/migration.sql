-- CreateTable
CREATE TABLE "wp_session" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wp_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wp_session_sessionId_key" ON "wp_session"("sessionId");
