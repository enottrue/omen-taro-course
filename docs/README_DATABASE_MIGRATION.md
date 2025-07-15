# 🗄️ Database Migration & Setup Guide

Полное руководство по настройке базы данных с нуля для проекта Omen Taro Course.

## 📋 Предварительные требования

- Docker и Docker Compose установлены
- Node.js 18+ и Yarn 4
- Git

## 🚀 Пошаговая настройка базы данных

### 1. Клонирование и установка зависимостей

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd omen-taro-course

# Установите зависимости
yarn install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/omen_taro_course"

# JWT Secret
APP_SECRET="your-super-secret-jwt-key-here"

# Stripe (для платежей)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Bitrix24 (для CRM интеграции)
BITRIX24_WEBHOOK_URL="https://your-domain.bitrix24.ru/rest/your-webhook/"
BITRIX24_ASSIGNED_BY_ID="your-assigned-by-id"
BITRIX24_CATEGORY_ID="your-category-id"

# Email (для отправки писем)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Запуск базы данных в Docker

```bash
# Запустите PostgreSQL в контейнере
docker-compose up -d postgres

# Проверьте, что контейнер запущен
docker ps
```

### 4. Генерация Prisma Client

```bash
# Сгенерируйте Prisma Client
npx prisma generate
```

### 5. Применение миграций

```bash
# Примените все миграции к базе данных
npx prisma migrate deploy

# Проверьте статус миграций
npx prisma migrate status
```

### 6. Заполнение базы тестовыми данными (Seed)

```bash
# Запустите seed скрипт
npx prisma db seed
```

**Важно:** Seed скрипт автоматически:
- Очищает базу данных
- Создает тестовых пользователей с явными ID (1, 2, 3, 4, 5, 6)
- Сбрасывает sequence для автоинкремента
- Создает курсы, уроки, этапы и инструменты

### 7. Проверка настройки

```bash
# Откройте Prisma Studio для просмотра данных
npx prisma studio
```

Откроется веб-интерфейс на `http://localhost:5555` для просмотра и редактирования данных.

## 🔧 Решение проблем

### Проблема: "Unique constraint failed on the fields: (id)"

**Причина:** Sequence для автоинкремента не синхронизирован с данными.

**Решение:**
```sql
-- Выполните в Prisma Studio или через psql
SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"));
```

### Проблема: База данных недоступна

**Проверьте:**
```bash
# Статус контейнера
docker ps

# Логи контейнера
docker logs <postgres-container-name>

# Подключение к базе
docker exec -it <postgres-container-name> psql -U postgres -d omen_taro_course
```

### Проблема: Миграции не применяются

**Решение:**
```bash
# Сбросьте базу и примените миграции заново
npx prisma migrate reset

# Или примените миграции принудительно
npx prisma migrate deploy --force
```

## 📊 Структура базы данных

### Основные таблицы:
- **User** - пользователи системы
- **Course** - курсы
- **Lesson** - уроки
- **Stage** - этапы уроков
- **StageStatus** - статусы прохождения этапов
- **Tool** - инструменты
- **StageTimecode** - временные метки для этапов

### Связи:
- User ↔ StageStatus (один ко многим)
- Course ↔ Lesson (один ко многим)
- Lesson ↔ Stage (один ко многим)
- Stage ↔ StageStatus (один ко многим)
- Stage ↔ StageTimecode (один ко многим)

## 🚀 Запуск приложения

После настройки базы данных:

```bash
# Запустите приложение в режиме разработки
yarn dev

# Или через npm
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

## 🔄 Обновление базы данных

### При изменении схемы:

```bash
# Создайте новую миграцию
npx prisma migrate dev --name "description-of-changes"

# Примените миграцию в продакшене
npx prisma migrate deploy
```

### При добавлении новых seed данных:

```bash
# Обновите файлы в src/lib/dump-data/
# Затем запустите seed
npx prisma db seed
```

## 📝 Полезные команды

```bash
# Просмотр схемы базы данных
npx prisma db pull

# Сброс базы данных (удаляет все данные)
npx prisma migrate reset

# Экспорт данных
npx prisma db pull --print

# Проверка подключения к базе
npx prisma db push --preview-feature
```

## 🛠️ Отладка

### Логи Prisma:
```bash
# Включите логи Prisma в .env.local
DEBUG="prisma:*"
```

### Проверка подключения:
```bash
# Тест подключения к базе
npx prisma db execute --stdin
```

## ✅ Чек-лист настройки

- [ ] Docker контейнер с PostgreSQL запущен
- [ ] Переменные окружения настроены
- [ ] Prisma Client сгенерирован
- [ ] Миграции применены
- [ ] Seed данные загружены
- [ ] Sequence для User сброшен
- [ ] Prisma Studio открывается
- [ ] Приложение запускается без ошибок
- [ ] Регистрация пользователей работает

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи Docker контейнера
2. Убедитесь, что все переменные окружения настроены
3. Проверьте статус миграций
4. Обратитесь к документации Prisma: https://www.prisma.io/docs/ 