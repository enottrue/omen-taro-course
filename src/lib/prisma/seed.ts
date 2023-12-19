import tools from '../dump-data/toolsData';
import { prisma } from './prismaClient';
import users from '../dump-data/userData';

const main = async () => {
  console.log(`Start seeding...`);
  await prisma.tool.deleteMany({});
  await prisma.user.deleteMany({});

  console.log(`Database was wiped out. Ready to seeding it up.`);

  tools.forEach(async (tool) => {
    await prisma.tool.upsert({
      where: {
        id: tool.id,
      },
      create: tool,
      update: tool,
    });
  });

  users.forEach(async (user) => {
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: user,
      update: user,
    });
  });
  console.log(`Users Database was seeded.`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log(`Database disconnected.`);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    console.log(`Seeding was failed. Error happened.`);
    process.exit(1);
  });
