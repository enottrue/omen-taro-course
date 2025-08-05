# 🔑 Переменные окружения

## 📋 Описание

Этот документ описывает все необходимые переменные окружения для работы приложения, включая тестовые и боевые ключи Stripe.

## 🚀 Структура .env файла

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Production Stripe Keys (боевые ключи)
STRIPE_SECRET_KEY=sk_live_your_production_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret_here

# Test Stripe Keys (тестовые ключи для development режима)
STRIPE_TEST_SECRET_KEY=sk_test_your_test_secret_key_here
NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
STRIPE_TEST_WEBHOOK_SECRET=whsec_your_test_webhook_secret_here

# Database
DATABASE_URL=postgresql://appuser:yourpassword@db:5432/omen_taro_course

# Bitrix24
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/your_webhook_key/
BITRIX24_ASSIGNED_BY_ID=12345
BITRIX24_CATEGORY_ID=16

# App Secret
APP_SECRET=your_app_secret_here

# Other environment variables
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

## 🔧 Логика выбора ключей

### Development режим (`?ENV=Development`)
- `STRIPE_TEST_SECRET_KEY` - тестовый секретный ключ
- `NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY` - тестовый публичный ключ
- `STRIPE_TEST_WEBHOOK_SECRET` - тестовый webhook секрет

### Production режим (по умолчанию)
- `STRIPE_SECRET_KEY` - боевой секретный ключ
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - боевой публичный ключ
- `STRIPE_WEBHOOK_SECRET` - боевой webhook секрет

## 📊 Описание переменных

### Stripe Keys

| Переменная | Описание | Режим |
|------------|----------|-------|
| `STRIPE_SECRET_KEY` | Боевой секретный ключ Stripe | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Боевой публичный ключ Stripe | Production |
| `STRIPE_WEBHOOK_SECRET` | Боевой webhook секрет | Production |
| `STRIPE_TEST_SECRET_KEY` | Тестовый секретный ключ Stripe | Development |
| `NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY` | Тестовый публичный ключ Stripe | Development |
| `STRIPE_TEST_WEBHOOK_SECRET` | Тестовый webhook секрет | Development |

### Database

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | URL подключения к PostgreSQL |

### Bitrix24

| Переменная | Описание |
|------------|----------|
| `BITRIX24_WEBHOOK_URL` | URL webhook для API Битрикс24 |
| `BITRIX24_ASSIGNED_BY_ID` | ID ответственного пользователя |
| `BITRIX24_CATEGORY_ID` | ID категории сделок |

### App

| Переменная | Описание |
|------------|----------|
| `APP_SECRET` | Секретный ключ приложения для JWT |
| `NEXT_PUBLIC_API_URL` | Публичный URL API |

## 🚀 Развертывание

### 1. Создание .env файла

```bash
# Скопируйте пример
cp docs/ENV_VARIABLES.md .env

# Или создайте вручную
touch .env
```

### 2. Заполнение переменных

Замените все placeholder значения на реальные:

```env
# Замените на ваши реальные ключи
STRIPE_SECRET_KEY=sk_live_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Проверка

```bash
# Проверьте, что файл создан
ls -la .env

# Проверьте переменные (не показывайте секреты!)
grep -v SECRET .env
```

## ⚠️ Безопасность

1. **Никогда не коммитьте .env файл**
   ```bash
   # Убедитесь, что .env в .gitignore
   echo ".env" >> .gitignore
   ```

2. **Используйте разные ключи для разных окружений**
   - Тестовые ключи для разработки
   - Боевые ключи для продакшена

3. **Регулярно ротируйте ключи**
   - Обновляйте ключи каждые 3-6 месяцев
   - Используйте ограничения по IP в Stripe

## 🔍 Проверка конфигурации

### Локальная разработка

```bash
# Запустите приложение
npm run dev

# Откройте в браузере
http://localhost:3000/?ENV=Development

# Проверьте консоль браузера
# Должны быть логи:
# 🌍 Environment: development
# 🔑 Stripe Secret Key (first 10 chars): sk_test_51...
```

### Продакшн

```bash
# Соберите приложение
npm run build

# Запустите
npm start

# Проверьте логи
# Должны быть логи:
# 🌍 Environment: production
# 🔑 Stripe Secret Key (first 10 chars): sk_live_51...
```

## 📞 Поддержка

Если возникли проблемы с переменными окружения:

1. Проверьте, что файл `.env` существует
2. Убедитесь, что все переменные заполнены
3. Проверьте права доступа к файлу
4. Перезапустите приложение после изменения `.env` 