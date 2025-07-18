# Prisma Studio: Правильное создание уроков

## Проблема
При создании нового урока в Prisma Studio возникает ошибка:
```
Invalid `prisma.lesson.create()` invocation: Unique constraint failed on the fields: (`id`)
```

## Причина ошибки
Проблема возникает из-за **несинхронизированного sequence** в базе данных PostgreSQL. Это происходит когда:

1. Уроки были созданы с явным указанием `id` (например, через seed или импорт данных)
2. PostgreSQL sequence не обновился автоматически
3. При попытке создать новый урок Prisma пытается использовать уже существующий ID

## Решение проблемы

### 1. Проверьте существующие уроки
```bash
node check-existing-lessons.js
```

### 2. Исправьте sequence
```bash
node fix-sequence.js
```

Этот скрипт:
- Находит максимальный ID в таблице Lesson
- Обновляет sequence до правильного значения
- Тестирует создание нового урока
- Удаляет тестовый урок

### 3. Теперь можно создавать уроки в Prisma Studio

## Правильный способ создания урока в Prisma Studio

### 1. Откройте Prisma Studio
```bash
npx prisma studio
```

### 2. Перейдите к модели Lesson
- Нажмите на модель `Lesson` в левой панели

### 3. Нажмите "Add record"

### 4. Заполните поля (БЕЗ указания id):
```json
{
  "lessonNumber": 6,
  "lessonName": "Bonus Module: Annual Financial Forecast",
  "lessonDescription": "This is the description for Lesson 6",
  "lessonTimecodes": ["00:00", "01:00", "02:00"],
  "lessonStatus": "new",
  "courseId": 1
}
```

### 5. НЕ заполняйте поле `id` - оно будет сгенерировано автоматически

## Что НЕ нужно делать

❌ **НЕ копируйте данные из существующих уроков**, так как они содержат поле `id`:
```json
{
  "id": 6,  // ❌ НЕ УКАЗЫВАЙТЕ ЭТО ПОЛЕ
  "lessonNumber": 6,
  "lessonName": "Bonus Module: Annual Financial Forecast",
  // ... остальные поля
}
```

## Схема модели Lesson

```prisma
model Lesson {
  id                Int      @id @default(autoincrement())  // Автогенерация
  lessonNumber      Int
  lessonName        String
  lessonDescription String?
  lessonStages      Stage[]
  lessonTimecodes   String[]
  lessonStatus      String   @default("new")
  courseId          Int
  course            Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## Допустимые поля для создания (LessonCreateInput)

- ✅ `lessonNumber: Int` (обязательное)
- ✅ `lessonName: String` (обязательное)
- ✅ `lessonDescription?: String` (опциональное)
- ✅ `lessonTimecodes?: String[]` (опциональное)
- ✅ `lessonStatus?: String` (опциональное, по умолчанию "new")
- ✅ `courseId: Int` (обязательное)
- ❌ `id` - НЕ указывать (генерируется автоматически)
- ❌ `createdAt` - НЕ указывать (генерируется автоматически)
- ❌ `updatedAt` - НЕ указывать (генерируется автоматически)

## Пример правильного создания через код

```typescript
const newLesson = await prisma.lesson.create({
  data: {
    lessonNumber: 6,
    lessonName: "Bonus Module: Annual Financial Forecast",
    lessonDescription: "This is the description for Lesson 6",
    lessonTimecodes: ["00:00", "01:00", "02:00"],
    lessonStatus: "new",
    course: {
      connect: { id: 1 } // Подключаем к существующему курсу
    }
  }
});
```

## Исправления в коде

1. **Файл seed.ts** - исправлен для правильного создания уроков без `id`
2. **Создан скрипт create-test-lesson.js** - демонстрирует правильный и неправильный способы создания
3. **Создан скрипт check-existing-lessons.js** - проверяет существующие уроки и sequence
4. **Создан скрипт fix-sequence.js** - исправляет проблему с sequence

## Диагностика проблем

### Проверка sequence
```bash
node check-existing-lessons.js
```

### Исправление sequence
```bash
node fix-sequence.js
```

### Тестирование создания урока
```bash
node create-test-lesson.js
```

## Резюме

При создании новых записей в Prisma Studio:
1. **Убедитесь, что sequence синхронизирован** - используйте `fix-sequence.js`
2. **НЕ указывайте поля с `@default()`** - они генерируются автоматически
3. **НЕ копируйте данные из существующих записей** - они содержат `id`
4. **Заполняйте только обязательные и опциональные поля** без значений по умолчанию

## Частые ошибки и решения

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `Unknown arg 'id'` | Указан `id` при создании | Уберите поле `id` |
| `Unique constraint failed on id` | Sequence не синхронизирован | Запустите `fix-sequence.js` |
| `Foreign key constraint failed` | Неверный `courseId` | Убедитесь, что курс существует | 