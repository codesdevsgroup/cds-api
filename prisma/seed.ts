import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'teste@teste.com' },
    update: {},
    create: {
      email: 'teste@teste.com',
      username: 'teste',
      password: '$2b$10$H62/bxhk4DJtNkNXzsCNJuDPlFKHiHtHPTkl6eW78IreD/sYCPiQK',
      isActive: true,
      createdAt: new Date(),
      role: 'ADMIN',
      termsAccepted: true,
    },
  });

  const config = await prisma.config.findFirst();

  if (!config) {
    await prisma.config.create({
      data: {
        name: '',
        email: 'teste@teste.com',
        mobile: '',
        phone1: '',
        phone2: '',
        place: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
