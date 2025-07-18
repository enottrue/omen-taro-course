# Полное Руководство по Развертыванию - Omen Taro Course

## 📋 Содержание

1. [Предварительные требования](#предварительные-требования)
2. [Настройка окружения](#настройка-окружения)
3. [Установка зависимостей](#установка-зависимостей)
4. [Настройка базы данных](#настройка-базы-данных)
5. [Миграции Prisma](#миграции-prisma)
6. [Seed базы данных](#seed-базы-данных)
7. [Сборка и запуск](#сборка-и-запуск)
8. [Автоматическое развертывание](#автоматическое-развертывание)
9. [Мониторинг и логирование](#мониторинг-и-логирование)
10. [Troubleshooting](#troubleshooting)

## 🔧 Предварительные требования

### Системные требования
- **Node.js**: версия 18+ 
- **npm** или **yarn**: для управления зависимостями
- **PostgreSQL**: версия 12+ (для продакшена)
- **Git**: для клонирования репозитория

### Проверка версий
```bash
node --version    # Должно быть v18+
npm --version     # Должно быть 8+
psql --version    # Должно быть 12+
git --version     # Любая актуальная версия
```

## 🌍 Настройка окружения

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd omen-taro-course
```

### 2. Создание файла .env
```bash
cp .env.example .env
```

### 3. Настройка переменных окружения

#### Основные переменные
```env
# База данных
DATABASE_URL="postgresql://username:password@localhost:5432/omen_taro_db"

# Next.js
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Аутентификация
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Stripe (для платежей)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Bitrix24 (для интеграции)
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/webhook_key/
BITRIX24_CLIENT_ID=your-client-id
BITRIX24_CLIENT_SECRET=your-client-secret

# Email (для уведомлений)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

#### Продакшен переменные
```env
NODE_ENV=production
DATABASE_URL="postgresql://prod_user:prod_password@prod_host:5432/prod_db"
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

## 📦 Установка зависимостей

### 1. Установка npm пакетов
```bash
npm install
```

### 2. Проверка установки
```bash
npm list --depth=0
```

### 3. Установка глобальных зависимостей (опционально)
```bash
npm install -g prisma
npm install -g @prisma/client
```

## 🗄️ Настройка базы данных

### 1. Создание базы данных PostgreSQL

#### Локально
```bash
# Подключение к PostgreSQL
psql -U postgres

# Создание базы данных
CREATE DATABASE omen_taro_db;

# Создание пользователя (опционально)
CREATE USER omen_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE omen_taro_db TO omen_user;

# Выход
\q
```

#### На удаленном сервере
```bash
# Подключение к удаленному серверу
psql -h your-host -U your-user -d postgres

# Создание базы данных
CREATE DATABASE omen_taro_db;
```

### 2. Проверка подключения
```bash
# Тест подключения
psql $DATABASE_URL -c "SELECT version();"
```

## 🔄 Миграции Prisma

### 1. Генерация Prisma клиента
```bash
npx prisma generate
```

### 2. Применение миграций
```bash
# Применение всех миграций
npx prisma migrate deploy

# Или для разработки
npx prisma migrate dev
```

### 3. Проверка статуса миграций
```bash
npx prisma migrate status
```

### 4. Создание новой миграции (при изменении схемы)
```bash
# После изменения schema.prisma
npx prisma migrate dev --name add_new_field
```

### 5. Сброс базы данных (только для разработки)
```bash
# ⚠️ ОСТОРОЖНО! Удаляет все данные
npx prisma migrate reset
```

## 🌱 Seed базы данных

### 1. Автоматический seed через Prisma
```bash
npx prisma db seed
```

### 2. Ручной seed через Node.js
```bash
node seed-current.js
```

### 3. Полное развертывание с нуля
```bash
node deploy-from-scratch.js
```

### 4. Проверка seed данных
```bash
# Проверка количества записей
node check-all-tables.js

# Тест создания новых записей
node create-test-lesson.js
```

### Ожидаемый результат seed
```
🌱 Начинаем сидинг базы данных с текущими данными...
📅 Дата экспорта: 2025-07-18

✅ Пользователи добавлены: 7
✅ Курсы добавлены: 1
✅ Уроки добавлены: 5
✅ Этапы добавлены: 7
✅ Таймкоды этапов добавлены: 15
✅ Статусы этапов добавлены: 7
✅ Инструменты добавлены: 11

📈 Статистика сидинга:
Всего записей: 53

🎉 Сидинг базы данных завершен успешно!
```

## 🏗️ Сборка и запуск

### 1. Сборка проекта
```bash
# Сборка для продакшена
npm run build

# Проверка сборки
npm run start
```

### 2. Запуск в режиме разработки
```bash
npm run dev
```

### 3. Запуск в продакшене
```bash
# Использование PM2
npm install -g pm2
pm2 start npm --name "omen-taro" -- start

# Или напрямую
npm start
```

## 🤖 Автоматическое развертывание

### 1. Полное развертывание с нуля
```bash
node deploy-from-scratch.js
```

Этот скрипт автоматически выполняет:
- ✅ Проверку Node.js версии
- ✅ Установку зависимостей
- ✅ Проверку переменных окружения
- ✅ Генерацию Prisma клиента
- ✅ Применение миграций
- ✅ Seed базы данных
- ✅ Тестирование создания записей
- ✅ Сборку проекта

### 2. Docker развертывание
```bash
# Сборка образа
docker build -t omen-taro-course .

# Запуск контейнера
docker run -p 3000:3000 --env-file .env omen-taro-course
```

### 3. Docker Compose
```bash
# Запуск с базой данных
docker-compose up -d

# Остановка
docker-compose down
```

## 📊 Мониторинг и логирование

### 1. Проверка состояния приложения
```bash
# Проверка процессов
ps aux | grep node

# Проверка портов
netstat -tulpn | grep :3000

# Проверка логов
tail -f logs/app.log
```

### 2. Мониторинг базы данных
```bash
# Подключение к базе данных
psql $DATABASE_URL

# Проверка таблиц
\dt

# Проверка количества записей
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

# Проверка sequences
SELECT 
  sequence_name,
  last_value,
  start_value,
  increment_by
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;
```

### 3. Логирование Prisma
```typescript
// В prismaClient.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## 🚨 Troubleshooting

### Ошибки базы данных

#### "Connection refused"
```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Перезапуск PostgreSQL
sudo systemctl restart postgresql

# Проверка подключения
psql $DATABASE_URL -c "SELECT 1;"
```

#### "Database does not exist"
```bash
# Создание базы данных
createdb omen_taro_db

# Или через psql
psql -U postgres -c "CREATE DATABASE omen_taro_db;"
```

#### "Permission denied"
```bash
# Проверка прав пользователя
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE omen_taro_db TO your_user;"
```

### Ошибки миграций

#### "Migration failed"
```bash
# Сброс миграций (только для разработки)
npx prisma migrate reset

# Применение миграций заново
npx prisma migrate deploy
```

#### "Schema drift detected"
```bash
# Синхронизация схемы
npx prisma db push

# Или создание новой миграции
npx prisma migrate dev --name fix_schema_drift
```

### Ошибки seed

#### "Unknown arg `id` in data.id"
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

#### "Foreign key constraint fails"
```bash
# Проверка маппинга ID в seed файле
# Убедитесь, что все связи правильные

# Перезапуск seed
npx prisma db seed
```

#### "Sequence not synchronized"
```bash
# Сброс sequence вручную
psql $DATABASE_URL -c "SELECT setval('\"Lesson_id_seq\"', (SELECT MAX(id) FROM \"Lesson\"));"

# Или перезапуск seed
npx prisma db seed
```

### Ошибки сборки

#### "Module not found"
```bash
# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install
```

#### "TypeScript errors"
```bash
# Проверка TypeScript
npx tsc --noEmit

# Исправление ошибок в коде
```

### Ошибки запуска

#### "Port already in use"
```bash
# Поиск процесса на порту 3000
lsof -i :3000

# Завершение процесса
kill -9 <PID>
```

#### "Environment variables missing"
```bash
# Проверка .env файла
cat .env

# Проверка переменных в коде
node -e "console.log(process.env.DATABASE_URL);"
```

## 📋 Чек-лист развертывания

### ✅ Предварительная подготовка
- [ ] Node.js 18+ установлен
- [ ] PostgreSQL установлен и запущен
- [ ] Репозиторий склонирован
- [ ] .env файл создан и настроен

### ✅ Установка и настройка
- [ ] Зависимости установлены (`npm install`)
- [ ] База данных создана
- [ ] Подключение к БД протестировано

### ✅ Миграции и данные
- [ ] Prisma клиент сгенерирован
- [ ] Миграции применены
- [ ] Seed выполнен успешно
- [ ] Данные проверены

### ✅ Сборка и запуск
- [ ] Проект собран (`npm run build`)
- [ ] Приложение запущено
- [ ] Доступность проверена
- [ ] Логи проверены

### ✅ Тестирование
- [ ] Создание новых записей протестировано
- [ ] Prisma Studio работает
- [ ] Все функции приложения работают

## 🔗 Полезные ссылки

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Последнее обновление**: 2025-07-18  
**Версия**: 2.0  
**Статус**: ✅ Готово к продакшену 