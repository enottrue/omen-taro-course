# Быстрое Развертывание - Omen Taro Course

## 🚀 Экспресс-развертывание за 5 минут

### 1. Клонирование и настройка
```bash
git clone <repository-url>
cd omen-taro-course
cp .env.example .env
```

### 2. Настройка .env (обязательные поля)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/omen_taro_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Автоматическое развертывание
```bash
node deploy-from-scratch.js
```

### 4. Запуск приложения
```bash
npm run dev
```

Готово! Приложение доступно по адресу: http://localhost:3000

---

## 📋 Минимальные требования

- Node.js 18+
- PostgreSQL 12+
- 5 минут времени

## 🔧 Альтернативный способ (ручной)

### 1. Установка зависимостей
```bash
npm install
```

### 2. Создание базы данных
```bash
createdb omen_taro_db
```

### 3. Миграции и seed
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 4. Запуск
```bash
npm run dev
```

## ✅ Проверка установки

### Проверка данных
```bash
node check-all-tables.js
```

### Тест создания записей
```bash
node create-test-lesson.js
```

### Открытие Prisma Studio
```bash
npx prisma studio
```

## 🚨 Быстрое исправление проблем

### Ошибка подключения к БД
```bash
# Проверка PostgreSQL
sudo systemctl status postgresql
sudo systemctl start postgresql

# Создание БД
createdb omen_taro_db
```

### Ошибка миграций
```bash
npx prisma migrate reset
npx prisma migrate deploy
```

### Ошибка seed
```bash
npx prisma db seed
```

### Ошибка порта
```bash
# Поиск процесса
lsof -i :3000
kill -9 <PID>
```

## 📊 Ожидаемый результат

После успешного развертывания:
- ✅ 53 записи в базе данных
- ✅ 7 пользователей (включая тестовые)
- ✅ 1 курс с 5 уроками
- ✅ 7 этапов с таймкодами
- ✅ 11 инструментов
- ✅ Работающие интеграции

## 🔗 Полезные команды

```bash
# Проверка статуса
npm run build
npm start

# Логи
tail -f logs/app.log

# База данных
psql $DATABASE_URL
\dt
SELECT COUNT(*) FROM "User";
```

---

**Время развертывания**: 5 минут  
**Статус**: ✅ Протестировано 