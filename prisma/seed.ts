import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criação/atualização do usuário
  const user = await prisma.user.upsert({
    where: { email: 'teste@teste.com' },
    update: {},
    create: {
      email: 'teste@teste.com',
      username: 'teste',
      password: '$2b$10$H62/bxhk4DJtNkNXzsCNJuDPlFKHiHtHPTkl6eW78IreD/sYCPiQK',
      isActive: true,
      createdAt: new Date(),
      termsAccepted: true,
      permissions: {
        create: [
          {
            interface: 'wpbot',
            canView: true,
            canAdd: true,
            canEdit: true,
            canDelete: true,
          },
        ],
      },
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
