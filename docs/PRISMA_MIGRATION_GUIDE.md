# Руководство по Миграциям Prisma - Omen Taro Course

## 📋 Содержание

1. [Основы миграций](#основы-миграций)
2. [Команды миграций](#команды-миграций)
3. [Рабочий процесс](#рабочий-процесс)
4. [Управление схемой](#управление-схемой)
5. [Troubleshooting](#troubleshooting)
6. [Лучшие практики](#лучшие-практики)

## 🔄 Основы миграций

### Что такое миграции Prisma?

Миграции - это способ управления изменениями схемы базы данных. Prisma автоматически создает SQL файлы для каждого изменения схемы.

### Структура миграций

```
src/lib/prisma/migrations/
├── 20231218012620_/
│   └── migration.sql
├── 20231219141814_user/
│   └── migration.sql
├── 20231219144245_minor_changes/
│   └── migration.sql
└── migration_lock.toml
```

### Типы миграций

1. **Создание таблиц** - `CREATE TABLE`
2. **Изменение полей** - `ALTER TABLE`
3. **Добавление индексов** - `CREATE INDEX`
4. **Изменение связей** - `FOREIGN KEY`

## 🛠️ Команды миграций

### 1. Создание новой миграции

```bash
# Создание миграции после изменения schema.prisma
npx prisma migrate dev --name descriptive_name

# Примеры
npx prisma migrate dev --name add_user_fields
npx prisma migrate dev --name create_lesson_table
npx prisma migrate dev --name add_payment_integration
```

### 2. Применение миграций

```bash
# Применение всех миграций (продакшен)
npx prisma migrate deploy

# Применение миграций с перезапуском (разработка)
npx prisma migrate dev
```

### 3. Проверка статуса

```bash
# Статус миграций
npx prisma migrate status

# История миграций
npx prisma migrate status --verbose
```

### 4. Сброс миграций

```bash
# ⚠️ ОСТОРОЖНО! Удаляет все данные
npx prisma migrate reset

# Сброс с подтверждением
npx prisma migrate reset --force
```

### 5. Генерация клиента

```bash
# Генерация Prisma Client
npx prisma generate

# Генерация с обновлением
npx prisma generate --schema=./src/lib/prisma/schema.prisma
```

## 🔄 Рабочий процесс

### Разработка (Development)

```bash
# 1. Изменить schema.prisma
# 2. Создать миграцию
npx prisma migrate dev --name your_changes

# 3. Проверить изменения
npx prisma studio

# 4. Протестировать код
npm run dev
```

### Продакшен (Production)

```bash
# 1. Применить миграции
npx prisma migrate deploy

# 2. Сгенерировать клиент
npx prisma generate

# 3. Проверить статус
npx prisma migrate status
```

### Тестирование

```bash
# 1. Сброс тестовой БД
npx prisma migrate reset

# 2. Применение миграций
npx prisma migrate deploy

# 3. Seed данных
npx prisma db seed

# 4. Запуск тестов
npm test
```

## 📊 Управление схемой

### Изменение таблиц

#### Добавление поля
```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  // Новое поле
  phone String?
}
```

#### Изменение типа поля
```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  // Изменение типа
  phone String? // было Int?
}
```

#### Добавление связи
```prisma
model User {
  id       Int      @id @default(autoincrement())
  name     String
  email    String   @unique
  // Новая связь
  lessons  Lesson[]
}

model Lesson {
  id       Int      @id @default(autoincrement())
  name     String
  // Связь с пользователем
  userId   Int
  user     User     @relation(fields: [userId], references: [id])
}
```

### Индексы и ограничения

#### Добавление индекса
```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  phone String?

  @@index([email, phone])
}
```

#### Уникальные ограничения
```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  phone String?

  @@unique([email, phone])
}
```

## 🚨 Troubleshooting

### Ошибки миграций

#### "Migration failed"
```bash
# Проверка ошибок
npx prisma migrate status

# Сброс и повторное применение
npx prisma migrate reset
npx prisma migrate deploy
```

#### "Schema drift detected"
```bash
# Синхронизация схемы
npx prisma db push

# Или создание миграции
npx prisma migrate dev --name fix_drift
```

#### "Database connection failed"
```bash
# Проверка подключения
psql $DATABASE_URL -c "SELECT 1;"

# Проверка переменных окружения
echo $DATABASE_URL
```

### Ошибки схемы

#### "Field already exists"
```bash
# Проверка текущей схемы
npx prisma db pull

# Сравнение с schema.prisma
diff schema.prisma prisma/schema.prisma
```

#### "Foreign key constraint failed"
```bash
# Проверка связей
npx prisma studio

# Исправление данных
npx prisma migrate reset
npx prisma db seed
```

### Ошибки клиента

#### "Prisma Client not generated"
```bash
# Генерация клиента
npx prisma generate

# Проверка импорта
import { PrismaClient } from '@prisma/client'
```

#### "Type errors"
```bash
# Обновление типов
npx prisma generate

# Проверка TypeScript
npx tsc --noEmit
```

## 📈 Лучшие практики

### 1. Именование миграций

```bash
# ✅ Хорошо
npx prisma migrate dev --name add_user_phone_field
npx prisma migrate dev --name create_lesson_stages_table
npx prisma migrate dev --name add_payment_integration_fields

# ❌ Плохо
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
npx prisma migrate dev --name changes
```

### 2. Размер миграций

```bash
# ✅ Маленькие миграции
npx prisma migrate dev --name add_user_phone
npx prisma migrate dev --name add_user_address
npx prisma migrate dev --name add_user_birthday

# ❌ Большие миграции
npx prisma migrate dev --name add_all_user_fields
```

### 3. Проверка миграций

```bash
# Всегда проверяйте миграции
npx prisma migrate status
npx prisma studio
npm test
```

### 4. Резервное копирование

```bash
# Перед миграцией
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# После миграции
npx prisma migrate status
```

### 5. Тестирование

```bash
# Тестовая среда
NODE_ENV=test npx prisma migrate reset
NODE_ENV=test npx prisma migrate deploy
NODE_ENV=test npx prisma db seed
npm test
```

## 🔧 Полезные команды

### Диагностика

```bash
# Проверка схемы
npx prisma validate

# Просмотр SQL
npx prisma migrate dev --create-only

# Экспорт схемы
npx prisma db pull

# Синхронизация
npx prisma db push
```

### Мониторинг

```bash
# Статус БД
npx prisma migrate status

# Логи запросов
npx prisma studio

# Производительность
npx prisma studio --port 5556
```

### Утилиты

```bash
# Форматирование схемы
npx prisma format

# Валидация
npx prisma validate

# Документация
npx prisma generate --schema=./schema.prisma
```

## 📋 Чек-лист миграций

### ✅ Перед миграцией
- [ ] Схема протестирована локально
- [ ] Резервная копия создана
- [ ] Тесты проходят
- [ ] Документация обновлена

### ✅ Во время миграции
- [ ] Миграция применена
- [ ] Клиент сгенерирован
- [ ] Статус проверен
- [ ] Данные валидированы

### ✅ После миграции
- [ ] Приложение запущено
- [ ] Функции протестированы
- [ ] Логи проверены
- [ ] Мониторинг настроен

## 🔗 Полезные ссылки

- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Migration Commands](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [Best Practices](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate)

---

**Последнее обновление**: 2025-07-18  
**Версия**: 2.0  
**Статус**: ✅ Готово к использованию 