import tools from '../dump-data/toolsData';
import { prisma } from './prismaClient';
import users from '../dump-data/userData';
import { lessonsData, coursesData, stageData } from '../dump-data/lessonsData';

const main = async () => {
  console.log(`🌱 Начинаем сидинг базы данных...`);
  
  // Очищаем базу данных
  await prisma.stageStatus.deleteMany({});
  await prisma.stageTimecode.deleteMany({});
  await prisma.stage.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tool.deleteMany({});

  console.log(`🗑️ База данных очищена. Начинаем заполнение...`);

  // Сидим инструменты
  console.log(`🛠️ Сидим инструменты...`);
  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { id: tool.id },
      create: tool,
      update: tool,
    });
  }
  console.log(`✅ Инструменты добавлены: ${tools.length}`);

  // Сидим пользователей
  console.log(`👥 Сидим пользователей...`);
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        ...user,
        isPaid: user.isPaid || false,
        paymentDate: user.paymentDate || null,
        stripeSessionId: user.stripeSessionId || null,
        bitrix24ContactId: user.bitrix24ContactId || null,
        bitrix24DealId: user.bitrix24DealId || null,
        onboarded: user.onboarded || false,
      },
      update: {
        ...user,
        isPaid: user.isPaid || false,
        paymentDate: user.paymentDate || null,
        stripeSessionId: user.stripeSessionId || null,
        bitrix24ContactId: user.bitrix24ContactId || null,
        bitrix24DealId: user.bitrix24DealId || null,
        onboarded: user.onboarded || false,
      },
    });
  }
  console.log(`✅ Пользователи добавлены: ${users.length}`);

  // Сидим курсы
  console.log(`📚 Сидим курсы...`);
  for (const course of Object.values(coursesData)) {
    await prisma.course.upsert({
      where: { id: course.id },
      create: course,
      update: course,
    });
  }
  console.log(`✅ Курсы добавлены: ${Object.keys(coursesData).length}`);

  // Сидим уроки
  console.log(`📖 Сидим уроки...`);
  for (const lesson of Object.values(lessonsData)) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      create: lesson,
      update: lesson,
    });
  }
  console.log(`✅ Уроки добавлены: ${Object.keys(lessonsData).length}`);

  // Сидим этапы и таймкоды
  console.log(`🎯 Сидим этапы и таймкоды...`);
  for (const stage of stageData) {
    const { stageTimecodes, ...stageInfo } = stage;
    
    const createdStage = await prisma.stage.upsert({
      where: { id: stageInfo.id },
      create: stageInfo,
      update: stageInfo,
    });

    // Добавляем таймкоды для этапа
    for (const timecode of stageTimecodes) {
      await prisma.stageTimecode.upsert({
        where: { id: timecode.id },
        create: {
          ...timecode,
          stageId: createdStage.id,
        },
        update: {
          ...timecode,
          stageId: createdStage.id,
        },
      });
    }
  }
  console.log(`✅ Этапы и таймкоды добавлены: ${stageData.length} этапов`);

  console.log(`🎉 Сидинг базы данных завершен успешно!`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log(`🔌 Соединение с базой данных закрыто.`);
  })
  .catch(async (e) => {
    console.error('❌ Ошибка при сидинге:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
