import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  await prisma.scheduleOptions.deleteMany({});
  await prisma.provider.deleteMany({});
}

async function main() {
  await cleanDatabase();
  const provider = await prisma.provider.create({
    data: {
      email: 'test@email.com',
      name: 'test',
      cellphone: '+000000000000',
      slug: 'Electricity',
    },
  });
  await prisma.scheduleOptions.create({
    data: {
      dayOfWeek: 1,
      duration: 30,
      startTime: 480,
      endTime: 1020,
      provider: {
        connect: {
          id: provider.id,
        },
      },
    },
  });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
