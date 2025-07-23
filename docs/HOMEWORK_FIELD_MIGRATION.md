# Миграция: Добавление поля Homework в таблицу Stage

## Обзор

Добавлено новое опциональное поле `homework` в таблицу `Stage` для хранения домашних заданий к каждому этапу урока.

## Детали миграции

### Файл миграции
- **Путь:** `src/lib/prisma/migrations/20250723005931_add_homework_field_to_stage/migration.sql`
- **Дата создания:** 23 июля 2025

### SQL команда
```sql
-- AlterTable
ALTER TABLE "Stage" ADD COLUMN "homework" TEXT;
```

## Изменения в схеме

### Prisma Schema (`src/lib/prisma/schema.prisma`)
```prisma
model Stage {
  id               Int             @id @default(autoincrement())
  stageNumber      Int
  stageName        String
  stageDescription String?
  homework         String?         // ← Новое поле
  lessonId         Int
  stageStatuses    StageStatus[]
  stageTimecodes   StageTimecode[]
  lesson           Lesson          @relation(fields: [lessonId], references: [id], onDelete: Cascade)
}
```

### GraphQL Schema (`src/graphql/schema.ts`)
```graphql
type Stage {
  id: ID!
  stageNumber: Int!
  stageName: String!
  stageDescription: String
  homework: String                 // ← Новое поле
  lessonId: Int
  lesson: Lesson
  stageStatuses: [StageStatus]
  stageTimecodes: [StageTimecode]
}
```

## Характеристики поля

- **Тип:** `String?` (опциональное)
- **База данных:** `TEXT` (PostgreSQL)
- **GraphQL:** `String` (может быть null)
- **Назначение:** Хранение домашних заданий для этапов урока

## Использование

### В GraphQL запросах
```graphql
query GetLesson($id: ID!) {
  getLesson(id: $id) {
    lessonStages {
      id
      stageNumber
      stageName
      stageDescription
      homework                    # ← Новое поле
      stageTimecodes {
        id
        name
        timeCodeStart
      }
    }
  }
}
```

### В Prisma запросах
```typescript
const stage = await prisma.stage.findUnique({
  where: { id: stageId },
  select: {
    id: true,
    stageNumber: true,
    stageName: true,
    stageDescription: true,
    homework: true,               # ← Новое поле
    stageTimecodes: true
  }
});
```

## Совместимость

- ✅ **Обратная совместимость:** Поле опциональное, существующие данные не затронуты
- ✅ **Автоматическое разрешение:** Prisma автоматически обрабатывает новое поле
- ✅ **GraphQL:** Поле доступно в запросах и мутациях
- ✅ **Типизация:** TypeScript типы обновлены автоматически

## Следующие шаги

1. **Обновление интерфейса:** Добавить отображение домашних заданий в компонентах
2. **Административная панель:** Добавить возможность редактирования домашних заданий
3. **Валидация:** Добавить проверки для поля homework
4. **Документация:** Обновить документацию API

## Проверка миграции

```bash
# Проверить статус миграций
npx prisma migrate status

# Применить миграцию (если не применена)
npx prisma migrate deploy

# Сгенерировать клиент
npx prisma generate
```

## Пример данных

```json
{
  "id": 1,
  "stageNumber": 1,
  "stageName": "Lesson 1 - The Basics",
  "stageDescription": "Introduction to the topic",
  "homework": "Practice building your birth chart using the techniques learned in this lesson. Focus on identifying your ruling planets and house cusps.",
  "lessonId": 1
}
``` 