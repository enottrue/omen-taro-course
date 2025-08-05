# 🔧 Исправление прав доступа в Bitrix24

## ❌ Проблема

Получена ошибка `insufficient_scope` при попытке создать счет в Bitrix24:
```
HTTP error! status: 401, response: {"error":"insufficient_scope","error_description":"The request requires higher privileges than provided by the webhook token"}
```

## 🔍 Диагностика

Webhook токен не имеет достаточных прав для выполнения операций в Bitrix24.

## ✅ Решение

### 1. Проверьте текущий webhook

1. Войдите в Bitrix24: `https://crm.taroirena.com`
2. Перейдите в **Настройки** → **Интеграции** → **Входящий вебхук**
3. Найдите webhook с URL: `https://crm.taroirena.com/rest/49468/d9cuna1b89mnipbq/`

### 2. Обновите права доступа

Убедитесь, что webhook имеет следующие права:

#### Обязательные права:
- ✅ **CRM** - полный доступ
- ✅ **Пользователи** - чтение
- ✅ **Счета** - полный доступ

#### Дополнительные права (если используете смарт-процессы):
- ✅ **Смарт-процессы** - полный доступ
- ✅ **Типы смарт-процессов** - чтение

### 3. Создайте новый webhook (рекомендуется)

Если текущий webhook не работает, создайте новый:

1. В Bitrix24: **Настройки** → **Интеграции** → **Входящий вебхук**
2. Нажмите **"Создать вебхук"**
3. Введите название: `Omen Taro Course Integration`
4. Выберите права доступа:
   - ✅ **CRM** - полный доступ
   - ✅ **Пользователи** - чтение
   - ✅ **Счета** - полный доступ
5. Нажмите **"Сохранить"**
6. Скопируйте новый URL

### 4. Обновите переменную окружения

После создания нового webhook обновите `BITRIX24_WEBHOOK_URL` в вашем `.env` файле:

```env
# Старый webhook (не работает)
# BITRIX24_WEBHOOK_URL=https://crm.taroirena.com/rest/49468/d9cuna1b89mnipbq/

# Новый webhook (замените на ваш)
BITRIX24_WEBHOOK_URL=https://crm.taroirena.com/rest/YOUR_NEW_WEBHOOK_KEY/
```

### 5. Проверьте права пользователя

Убедитесь, что пользователь с ID `30902` (BITRIX24_ASSIGNED_BY_ID) имеет права на:
- Создание счетов
- Создание смарт-процессов
- Доступ к CRM

### 6. Тестирование

После обновления прав протестируйте подключение:

```bash
curl -X GET "https://astro-irena.com/api/bitrix24/test-connection"
```

Ожидаемый ответ:
```json
{
  "connection": {
    "success": true,
    "webhookUrl": "https://crm.taroirena.com/rest/YOUR_NEW_WEBHOOK_KEY/",
    "assignedById": 30902
  }
}
```

## 🚨 Временное решение

Пока решаете проблему с правами, используйте упрощенную версию API:

```javascript
// Вместо
fetch('/api/stripe/create-checkout-session-with-invoice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    dealId: 86085,
    productName: 'Cosmo Course',
    amount: 5000,
    currency: 'usd'
  })
})

// Используйте
fetch('/api/stripe/create-checkout-session-simple', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    dealId: 86085,
    productName: 'Cosmo Course',
    amount: 5000,
    currency: 'usd'
  })
})
```

## 📋 Чек-лист

- [ ] Проверен текущий webhook в Bitrix24
- [ ] Обновлены права доступа webhook
- [ ] Создан новый webhook (если нужно)
- [ ] Обновлена переменная окружения
- [ ] Проверены права пользователя 30902
- [ ] Протестировано подключение
- [ ] Протестировано создание счета

## 🔗 Полезные ссылки

- [Документация Bitrix24 REST API](https://dev.1c-bitrix.ru/api_d7/rest/)
- [Справочник по правам доступа](https://dev.1c-bitrix.ru/api_d7/rest/general/auth.php)
- [Создание webhook в Bitrix24](https://helpdesk.bitrix24.ru/open/15411432/) 