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
    "usuarioId" TEXT NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "usuarioNome" VARCHAR(255) NOT NULL,
    "cpfCnpj" VARCHAR(14),
    "password" VARCHAR(255) NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "deletado" BOOLEAN NOT NULL DEFAULT false,
    "dataDeletado" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "dataactivacao" TIMESTAMP(3),
    "termoIp" VARCHAR(45),
    "termoAceitoed" BOOLEAN NOT NULL DEFAULT false,
    "pessoaId" INTEGER,
    "tokenVersao" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_usuarioNome_key" ON "user"("usuarioNome");

-- CreateIndex
CREATE UNIQUE INDEX "user_pessoaId_key" ON "user"("pessoaId");
