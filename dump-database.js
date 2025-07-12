const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function dumpDatabase() {
  try {
    console.log('🔄 Начинаем дамп базы данных...');

    // Дамп пользователей
    const users = await prisma.user.findMany();
    console.log(`📊 Найдено пользователей: ${users.length}`);

    // Дамп курсов
    const courses = await prisma.course.findMany();
    console.log(`📚 Найдено курсов: ${courses.length}`);

    // Дамп уроков
    const lessons = await prisma.lesson.findMany();
    console.log(`📖 Найдено уроков: ${lessons.length}`);

    // Дамп этапов
    const stages = await prisma.stage.findMany({
      include: {
        stageTimecodes: true,
      },
    });
    console.log(`🎯 Найдено этапов: ${stages.length}`);

    // Дамп инструментов
    const tools = await prisma.tool.findMany();
    console.log(`🛠️ Найдено инструментов: ${tools.length}`);

    // Дамп статусов этапов
    const stageStatuses = await prisma.stageStatus.findMany();
    console.log(`📈 Найдено статусов этапов: ${stageStatuses.length}`);

    // Создаем объект с данными
    const databaseDump = {
      users,
      courses,
      lessons,
      stages,
      tools,
      stageStatuses,
      dumpDate: new Date().toISOString(),
      totalRecords: users.length + courses.length + lessons.length + stages.length + tools.length + stageStatuses.length,
    };

    // Сохраняем в файл
    const dumpPath = path.join(__dirname, 'database-dump.json');
    fs.writeFileSync(dumpPath, JSON.stringify(databaseDump, null, 2));
    
    console.log(`✅ Дамп базы данных сохранен в: ${dumpPath}`);
    console.log(`📊 Всего записей: ${databaseDump.totalRecords}`);
    console.log(`📅 Дата дампа: ${databaseDump.dumpDate}`);

    // Создаем отдельные файлы для каждого типа данных
    const dumpsDir = path.join(__dirname, 'dumps');
    if (!fs.existsSync(dumpsDir)) {
      fs.mkdirSync(dumpsDir);
    }

    fs.writeFileSync(
      path.join(dumpsDir, 'users-dump.json'),
      JSON.stringify(users, null, 2)
    );

    fs.writeFileSync(
      path.join(dumpsDir, 'courses-dump.json'),
      JSON.stringify(courses, null, 2)
    );

    fs.writeFileSync(
      path.join(dumpsDir, 'lessons-dump.json'),
      JSON.stringify(lessons, null, 2)
    );

    fs.writeFileSync(
      path.join(dumpsDir, 'stages-dump.json'),
      JSON.stringify(stages, null, 2)
    );

    fs.writeFileSync(
      path.join(dumpsDir, 'tools-dump.json'),
      JSON.stringify(tools, null, 2)
    );

    fs.writeFileSync(
      path.join(dumpsDir, 'stage-statuses-dump.json'),
      JSON.stringify(stageStatuses, null, 2)
    );

    console.log(`📁 Отдельные файлы сохранены в папке: ${dumpsDir}`);

  } catch (error) {
    console.error('❌ Ошибка при дампе базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

dumpDatabase(); 