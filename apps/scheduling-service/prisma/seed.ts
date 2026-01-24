import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  await prisma.scheduleOptions.deleteMany({});
  await prisma.provider.deleteMany({});
  await prisma.customer.deleteMany({});
}

async function main() {
  await cleanDatabase();
  const provider = await prisma.provider.create({
    data: {
      email: 'test_provider@email.com',
      name: 'test_provider',
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
  await prisma.customer.create({
    data: {
      email: 'test_customer@email.com',
      name: 'test_customer',
      cellphone: '+000000000000',
    },
  });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
