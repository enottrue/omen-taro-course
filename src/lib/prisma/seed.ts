import tools from '../dump-data/toolsData';
import { prisma } from './prismaClient';
import users from '../dump-data/userData';
import { lessonsData, coursesData, stageData } from '../dump-data/lessonsData';

const main = async () => {
  console.log(`Start seeding...`);
  await prisma.tool.deleteMany({});
   // await prisma.user.deleteMany({});
 
  await prisma.stageTimecode.deleteMany({});

  await prisma.stage.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});

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

  for (const course in coursesData) {
    if (Object.prototype.hasOwnProperty.call(coursesData, course)) {
      const element = coursesData[course];
      await prisma.course.upsert({
        where: {
          id: element.id,
        },
        create: element,
        update: element,
      });
    }
  }

  console.log(`Cources Database was seeded.`);

  for (const lesson in lessonsData) {
    if (Object.prototype.hasOwnProperty.call(lessonsData, lesson)) {
      const element = lessonsData[lesson];
      await prisma.lesson.upsert({
        where: {
          id: element.id,
        },
        create: element,
        update: element,
      });
    }
  }
  console.log(`Lessons Database was seeded.`);

  for (const stage of stageData) {
    const { stageTimecodes, ...stageInfo } = stage;
    console.log('stt', stage);
    const createdStage = await prisma.stage.upsert({
      where: { id: stageInfo.id },
      create: stageInfo,
      update: stageInfo,
    });

    for (const timecode of stageTimecodes) {
      await prisma.stageTimecode.upsert({
        where: { id: timecode.id },
        create: timecode, // Fix: Pass the timecode directly
        update: timecode,
      });
    }
  }
  console.log(`Stage and StageTimeCodes Databases were seeded.`);
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
