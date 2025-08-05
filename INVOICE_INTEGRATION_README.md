# 🧪 Интеграция создания счетов в Bitrix24

## 📋 Обзор

Этот проект теперь включает рабочую интеграцию для создания счетов в Bitrix24 через смарт-процесс. Все тестовые файлы удалены, и настроена чистая рабочая система.

## 🗂️ Структура файлов

### API Endpoints
- `pages/api/bitrix24/create-invoice.ts` - Создание счета в Bitrix24
- `pages/api/bitrix24/create-deal.ts` - Создание сделки в Bitrix24
- `pages/api/stripe/create-checkout-session-with-invoice.ts` - Создание Stripe сессии с счетом

### Компоненты
- `src/components/InvoiceTest.tsx` - Компонент для тестирования создания счетов

### Страницы
- `pages/test-invoice.tsx` - Страница для тестирования создания счетов

### Утилиты
- `src/utils/bitrix24.ts` - Основные функции для работы с Bitrix24

## 🚀 Как использовать

### 1. Запуск сервера
```bash
npm run dev
```

### 2. Тестирование через веб-интерфейс
Откройте страницу: `http://localhost:3000/test-invoice`

### 3. Тестирование через API
```bash
node test-invoice-api.js
```

### 4. Тестирование через curl
```bash
curl -X POST http://localhost:3000/api/bitrix24/create-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "dealId": 12345,
    "productName": "Cosmo Course",
    "amount": 50,
    "currency": "USD"
  }'
```

## 🔧 Конфигурация

### Bitrix24 Webhook
- **URL:** `https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/`
- **Entity Type ID:** `31` (смарт-процесс для счетов)
- **Product ID:** `1777` (Compass)

### Поля счета
- `title` - Название счета
- `stageId` - Стадия (NEW)
- `assignedById` - Ответственный (1)
- `contactId` - Контакт (1)
- `opportunity` - Сумма
- `currencyId` - Валюта (USD)
- `parentId2` - Привязка к сделке
- `mycompanyId` - Компания (51)
- `sourceId` - Источник (UC_HZ10CI)
- `COMMENTS` - Комментарий с деталями

## 📊 Логирование

Все операции логируются в консоль с эмодзи для удобства:
- 🚀 - Запуск операции
- 📋 - Данные
- ✅ - Успех
- ❌ - Ошибка
- 🔄 - Альтернативный метод
- 📦 - Добавление товара
- 💰 - Создание счета

## 🔄 Альтернативные методы

Если создание через смарт-процесс не работает, система автоматически попробует:
1. Создание через обычный API счетов (`crm.invoice.add`)
2. Добавление товара через обычный API (`crm.invoice.update`)

## 🧹 Очистка

Удалены все тестовые файлы:
- `test-*.js` - Все тестовые скрипты
- `debug-*.js` - Все отладочные скрипты
- `src/components/Bitrix24Test.tsx` - Тестовый компонент
- `pages/api/bitrix24/test-connection.ts` - Тестовый API

## 🎯 Результат

Теперь при нажатии на кнопку оплаты:
1. Создается счет в Bitrix24 через смарт-процесс
2. Добавляется товар Compass к счету
3. Создается Stripe сессия для оплаты
4. Все операции логируются для отладки

## 🔍 Отладка

Для отладки используйте:
1. Консоль браузера (F12)
2. Консоль сервера Next.js
3. Страницу `/test-invoice` для ручного тестирования
4. Скрипт `test-invoice-api.js` для автоматического тестирования 