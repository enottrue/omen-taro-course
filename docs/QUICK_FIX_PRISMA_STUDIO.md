# Быстрое исправление ошибки Prisma Studio

## Проблема
При создании нового урока в Prisma Studio возникает ошибка:
```
Unique constraint failed on the fields: (`id`)
```

## Быстрое решение

### 1. Исправьте sequence
```bash
node fix-sequence.js
```

### 2. Теперь создавайте уроки в Prisma Studio
- НЕ указывайте поле `id`
- Заполните только нужные поля:
  - `lessonNumber`
  - `lessonName` 
  - `lessonDescription` (опционально)
  - `lessonTimecodes` (опционально)
  - `lessonStatus` (опционально, по умолчанию "new")
  - `courseId`

## Что произошло?
- Уроки были созданы с явным указанием ID
- PostgreSQL sequence не обновился
- Prisma пытался использовать уже существующий ID

## Профилактика
После каждого seed или импорта данных запускайте:
```bash
node fix-sequence.js
```

## Подробная документация
См. `PRISMA_LESSON_CREATION_GUIDE.md` 