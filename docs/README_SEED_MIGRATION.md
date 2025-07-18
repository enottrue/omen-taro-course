# Система Seed Миграции - Полное Руководство

## 📋 Обзор

Система seed миграции позволяет развернуть проект с нуля с точными текущими данными из базы данных. Система включает в себя:

- **Экспорт текущих данных** из всех таблиц
- **Seed файл Prisma** для автоматического заполнения при деплое
- **Скрипт развертывания** для полной автоматизации
- **Тестирование** корректности работы

## 🗂️ Структура файлов

```
src/lib/prisma/
├── seed.ts                    # Основной seed файл Prisma
├── prismaClient.ts           # Клиент Prisma
└── schema.prisma             # Схема базы данных

src/lib/dump-data/
├── currentData.ts            # Текущие данные всех таблиц
├── currentData.js            # JavaScript версия для Node.js
└── current-database-export.json # JSON экспорт

scripts/
├── seed-current.js           # Ручной seed скрипт
├── deploy-from-scratch.js    # Автоматическое развертывание
└── create-test-lesson.js     # Тестирование создания записей
```

## 🚀 Быстрый старт

### 1. Автоматическое развертывание с нуля

```bash
node deploy-from-scratch.js
```

Этот скрипт автоматически:
- Устанавливает зависимости
- Проверяет переменные окружения
- Генерирует Prisma клиент
- Применяет миграции
- Заполняет базу данных
- Тестирует создание новых записей
- Собирает проект

### 2. Ручной seed через Prisma

```bash
npx prisma db seed
```

### 3. Ручной seed через Node.js

```bash
node seed-current.js
```

## 📊 Данные в системе

### Текущие данные (2025-07-18)

| Таблица | Записей | Описание |
|---------|---------|----------|
| User | 7 | Пользователи с платежными данными |
| Course | 1 | Курс "Cosmo.Irena - Money Compass" |
| Lesson | 5 | Уроки курса |
| Stage | 7 | Этапы уроков |
| StageTimecode | 15 | Таймкоды этапов |
| StageStatus | 7 | Статусы прохождения этапов |
| Tool | 11 | Инструменты для обучения |

**Всего записей: 53**

## 🔧 Seed файл Prisma (`src/lib/prisma/seed.ts`)

### Особенности реализации

1. **Маппинг ID**: Правильная обработка связей между таблицами
2. **Удаление timestamp полей**: `createdAt` и `updatedAt` удаляются из данных создания
3. **Сброс sequence**: Автоматическая синхронизация PostgreSQL sequences
4. **Статистика**: Подробный отчет о процессе сидинга

### Порядок заполнения

1. **Пользователи** → маппинг ID
2. **Курсы** → маппинг ID  
3. **Уроки** → связь с курсами через маппинг
4. **Этапы** → связь с уроками через маппинг
5. **Таймкоды этапов** → связь с этапами через маппинг
6. **Статусы этапов** → связь с этапами и пользователями
7. **Инструменты** → независимые записи

### Сброс sequences

```sql
SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"));
SELECT setval('"Course_id_seq"', (SELECT MAX(id) FROM "Course"));
SELECT setval('"Lesson_id_seq"', (SELECT MAX(id) FROM "Lesson"));
SELECT setval('"Stage_id_seq"', (SELECT MAX(id) FROM "Stage"));
SELECT setval('"StageTimecode_id_seq"', (SELECT MAX(id) FROM "StageTimecode"));
SELECT setval('"StageStatus_id_seq"', (SELECT MAX(id) FROM "StageStatus"));
SELECT setval('"Tool_id_seq"', (SELECT MAX(id) FROM "Tool"));
```

## 🛠️ Настройка Prisma

### package.json

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} ./src/lib/prisma/seed.ts"
  }
}
```

### schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔍 Тестирование

### Тест создания новых записей

```bash
node create-test-lesson.js
```

Проверяет:
- ✅ Создание уроков без указания ID
- ❌ Ошибки при попытке указать ID
- ✅ Корректность sequence

### Ожидаемый результат

```
=== ПРАВИЛЬНЫЙ СПОСОБ СОЗДАНИЯ УРОКА ===
✅ Урок успешно создан!
📝 ID нового урока: 29

=== НЕПРАВИЛЬНЫЙ СПОСОБ СОЗДАНИЯ УРОКА ===
✅ Правильно! Ошибка при попытке создать урок с id

=== ПРОВЕРКА SEQUENCE ===
📊 Sequence last_value: 29
```

## 🚨 Устранение неполадок

### Ошибка: "Unknown arg `id` in data.id"

**Причина**: Попытка указать ID при создании записи
**Решение**: Не указывать поле `id` при создании, Prisma автоматически сгенерирует

```typescript
// ❌ Неправильно
await prisma.lesson.create({
  data: {
    id: 999, // Это вызовет ошибку
    lessonName: "Test"
  }
});

// ✅ Правильно
await prisma.lesson.create({
  data: {
    lessonName: "Test"
  }
});
```

### Ошибка: "duplicate key value violates unique constraint"

**Причина**: Sequence не синхронизирован
**Решение**: Запустить seed заново или сбросить sequence вручную

```sql
SELECT setval('"Lesson_id_seq"', (SELECT MAX(id) FROM "Lesson"));
```

### Ошибка: "foreign key constraint fails"

**Причина**: Неправильные связи между таблицами
**Решение**: Проверить маппинг ID в seed файле

## 📈 Мониторинг

### Проверка количества записей

```sql
SELECT 
  'User' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Course', COUNT(*) FROM "Course"
UNION ALL
SELECT 'Lesson', COUNT(*) FROM "Lesson"
UNION ALL
SELECT 'Stage', COUNT(*) FROM "Stage"
UNION ALL
SELECT 'StageTimecode', COUNT(*) FROM "StageTimecode"
UNION ALL
SELECT 'StageStatus', COUNT(*) FROM "StageStatus"
UNION ALL
SELECT 'Tool', COUNT(*) FROM "Tool";
```

### Проверка sequences

```sql
SELECT 
  sequence_name,
  last_value,
  start_value,
  increment_by
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;
```

## 🔄 Обновление данных

### Экспорт новых данных

```bash
node export-current-database.js
```

### Обновление seed файла

1. Запустить экспорт
2. Обновить `src/lib/dump-data/currentData.ts`
3. Протестировать seed: `npx prisma db seed`

## 📝 Логи и отладка

### Включение логов Prisma

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Проверка логов seed

```bash
npx prisma db seed 2>&1 | tee seed.log
```

## 🎯 Лучшие практики

1. **Всегда тестируйте** seed после изменений
2. **Проверяйте sequence** после сидинга
3. **Используйте маппинг ID** для связей
4. **Не указывайте ID** при создании записей
5. **Документируйте изменения** в данных

## 🔗 Связанные файлы

- `DEPLOYMENT_GUIDE.md` - Руководство по развертыванию
- `PRISMA_LESSON_CREATION_GUIDE.md` - Создание уроков
- `QUICK_FIX_PRISMA_STUDIO.md` - Быстрые исправления

---

**Последнее обновление**: 2025-07-18  
**Версия**: 2.0  
**Статус**: ✅ Протестировано и готово к продакшену 