const fs = require('fs');
const path = require('path');

async function updateFromDump() {
  try {
    console.log('🔄 Обновляем файлы данных из дампа...');

    // Читаем дамп базы данных
    const dumpPath = path.join(__dirname, 'database-dump.json');
    if (!fs.existsSync(dumpPath)) {
      console.error('❌ Файл database-dump.json не найден. Сначала запустите dump-database.js');
      return;
    }

    const databaseDump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
    console.log(`📊 Загружен дамп с ${databaseDump.totalRecords} записями`);

    // Обновляем файл userData.tsx
    if (databaseDump.users && databaseDump.users.length > 0) {
      const userDataPath = path.join(__dirname, 'src/lib/dump-data/userData.tsx');
      const userDataContent = `import { User } from './types';

export const userData: User[] = ${JSON.stringify(databaseDump.users, null, 2)};

export default userData;
`;
      fs.writeFileSync(userDataPath, userDataContent);
      console.log(`✅ Обновлен файл userData.tsx с ${databaseDump.users.length} пользователями`);
    }

    // Обновляем файл toolsData.tsx
    if (databaseDump.tools && databaseDump.tools.length > 0) {
      const toolsDataPath = path.join(__dirname, 'src/lib/dump-data/toolsData.tsx');
      const toolsDataContent = `import { Tool } from './types';

const data: Tool[] = ${JSON.stringify(databaseDump.tools, null, 2)};

export default data;
`;
      fs.writeFileSync(toolsDataPath, toolsDataContent);
      console.log(`✅ Обновлен файл toolsData.tsx с ${databaseDump.tools.length} инструментами`);
    }

    // Создаем новый файл с курсами и уроками
    if (databaseDump.courses && databaseDump.lessons && databaseDump.stages) {
      const lessonsDataPath = path.join(__dirname, 'src/lib/dump-data/lessonsData.tsx');
      
      // Формируем данные для экспорта
      const coursesData = databaseDump.courses;
      const lessonsData = databaseDump.lessons;
      const stageData = databaseDump.stages;

      const lessonsDataContent = `export const coursesData = ${JSON.stringify(coursesData, null, 2)};

export const lessonsData = ${JSON.stringify(lessonsData, null, 2)};

export const stageData = ${JSON.stringify(stageData, null, 2)};
`;
      fs.writeFileSync(lessonsDataPath, lessonsDataContent);
      console.log(`✅ Обновлен файл lessonsData.tsx`);
      console.log(`   - Курсов: ${coursesData.length}`);
      console.log(`   - Уроков: ${lessonsData.length}`);
      console.log(`   - Этапов: ${stageData.length}`);
    }

    console.log('🎉 Обновление файлов данных завершено!');
    console.log('💡 Теперь можно запустить сидинг: npm run seed');

  } catch (error) {
    console.error('❌ Ошибка при обновлении файлов:', error);
  }
}

updateFromDump(); 