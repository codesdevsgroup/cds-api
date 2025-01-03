import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.usuarios.create({
    data: {
      usuarioId: '1',
      email: 'user@example.com',
      usuarioNome: 'user1',
      password: 'password123',
      cpfCnpj: '12345678901',
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      deletado: false,
      activo: true,
      termoAceitoed: true,
      tokenVersao: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
