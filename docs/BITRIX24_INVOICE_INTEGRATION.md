# 💰 Интеграция создания счетов в Битрикс24 (Смарт-процессы)

## 📋 Описание

Этот документ описывает интеграцию создания счетов как смарт-процессов в Битрикс24 перед формированием ссылки на оплату Stripe. Система автоматически создает счет как смарт-процесс, привязывает его к сделке и передает ID счета в метаданные Stripe.

## 🔄 Процесс работы

1. **Создание сделки** - при регистрации пользователя создается сделка в Битрикс24
2. **Создание счета** - перед формированием ссылки на оплату создается счет как смарт-процесс в Битрикс24
3. **Привязка к сделке** - счет автоматически привязывается к существующей сделке
4. **Передача метаданных** - ID счета передается в метаданные Stripe
5. **Обработка платежа** - при успешной оплате обновляется статус пользователя

## 🛠️ API Endpoints

### Создание checkout session с invoice

**Endpoint:** `POST /api/stripe/create-checkout-session-with-invoice`

**Параметры:**
```typescript
{
  email: string;           // Email пользователя
  dealId: number;          // ID сделки в Битрикс24
  productName?: string;    // Название продукта (по умолчанию: 'Cosmo Course')
  amount?: number;         // Сумма в центах (по умолчанию: 5000)
  currency?: string;       // Валюта (по умолчанию: 'usd')
  ga_client_id?: string;   // Google Analytics Client ID
  product_id?: string;     // ID продукта
  page_identifier?: string; // Идентификатор страницы
}
```

**Ответ:**
```typescript
{
  sessionId: string;       // ID сессии Stripe
  invoiceId: number;       // ID счета в Битрикс24 (смарт-процесс)
  dealId: number;          // ID сделки в Битрикс24
}
```

## 📊 Метаданные Stripe

При создании checkout session передаются следующие метаданные:

```typescript
metadata: {
  email: string;           // Email пользователя
  product: 'cosmo_course'; // Тип продукта
  invoice_id: string;      // ID счета в Битрикс24 (смарт-процесс)
  ga_client_id: string;    // Google Analytics Client ID
  deal_id: string;         // ID сделки в Битрикс24
  item_id: string;         // ID товара
  item_name: string;       // Название страницы
}
```

## 🔧 Функции Битрикс24

### createInvoice(dealId, amount, currency)

Создает счет как смарт-процесс в Битрикс24 и привязывает его к сделке.

**Параметры:**
- `dealId: number` - ID сделки
- `amount: number` - Сумма счета
- `currency: string` - Валюта (по умолчанию: 'RUB')

**Возвращает:**
```typescript
{
  success: boolean;
  invoiceId?: number;
  error?: string;
}
```

**Используемые API методы:**
- `crm.item.add` - создание счета как смарт-процесса
- `entityTypeId: '31'` - ID типа смарт-процесса для счетов

### addProductToInvoice(invoiceId, productName, price, quantity)

Добавляет товар к счету в Битрикс24 (смарт-процесс).

**Параметры:**
- `invoiceId: number` - ID счета
- `productName: string` - Название товара
- `price: number` - Цена товара
- `quantity: number` - Количество (по умолчанию: 1)

**Возвращает:** `boolean`

**Используемые API методы:**
- `crm.item.update` - обновление счета с товарами

## 🎯 Использование в компонентах

### Базовое использование

```typescript
import { useStripePayment } from '@/hooks/useStripePayment';

const MyComponent = () => {
  const { handlePaymentWithInvoice } = useStripePayment();

  const handlePayment = async () => {
    try {
      await handlePaymentWithInvoice(dealId, {
        productName: 'Cosmo Course',
        amount: 100,
        currency: 'usd',
        ga_client_id: 'GA_CLIENT_ID',
        product_id: 'cosmo_course',
        page_identifier: 'course_page'
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Оплатить курс
    </button>
  );
};
```

### Получение GA Client ID

```typescript
// Получение GA Client ID из cookies
const getGAClientId = () => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  return cookies['_ga'] || null;
};
```

## 📈 Webhook обработка

При успешной оплате webhook обрабатывает дополнительные метаданные:

```typescript
// В pages/api/stripe/webhook.ts
const invoiceId = session.metadata?.invoice_id;
const dealId = session.metadata?.deal_id;
const gaClientId = session.metadata?.ga_client_id;
const itemId = session.metadata?.item_id;
const itemName = session.metadata?.item_name;

// Логирование для аналитики
if (gaClientId) {
  console.log('📊 GA Client ID for payment:', gaClientId);
}

if (invoiceId) {
  console.log('📄 Invoice ID for payment:', invoiceId);
}

if (dealId) {
  console.log('🤝 Deal ID for payment:', dealId);
}
```

## 🔍 Проверка и отладка

### Логирование

Все операции логируются в консоль:

```
💰 Создание счета в Битрикс24 (смарт-процесс)...
📋 Данные счета: { dealId: 123, amount: 50, currency: 'RUB' }
✅ Счет создан успешно: 456
📦 Добавление товара к счету (смарт-процесс)...
📋 Данные товара: { invoiceId: 456, productName: 'Cosmo Course', price: 50, quantity: 1 }
✅ Товар добавлен к счету успешно
🔄 Creating Stripe checkout session...
✅ Stripe session created successfully: cs_test_...
📋 Session metadata: { invoice_id: '456', deal_id: '123', ... }
```

### Проверка в Битрикс24

1. Откройте Битрикс24 CRM
2. Перейдите в раздел "Смарт-процессы"
3. Найдите созданный счет по номеру `INV-{timestamp}`
4. Проверьте привязку к сделке

## ⚠️ Важные замечания

1. **Обязательные параметры**: `email` и `dealId` должны быть переданы
2. **Обработка ошибок**: Все ошибки логируются и возвращаются пользователю
3. **Валюты**: Поддерживаются USD и RUB
4. **Суммы**: В Stripe передаются в центах, в Битрикс24 - в рублях
5. **Метаданные**: Все метаданные сохраняются в Stripe для последующего анализа
6. **Смарт-процессы**: Используется `entityTypeId: '31'` для счетов

## 🚀 Развертывание

1. Убедитесь, что настроены переменные окружения:
   ```env
   BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/...
   BITRIX24_ASSIGNED_BY_ID=12345
   BITRIX24_CATEGORY_ID=16
   STRIPE_SECRET_KEY=sk_test_...
   ```

2. Проверьте права доступа в Битрикс24:
   - Создание смарт-процессов (счета)
   - Обновление смарт-процессов
   - Чтение сделок

3. Протестируйте интеграцию:
   ```bash
   # Тестовый запрос
   curl -X POST http://localhost:3000/api/stripe/create-checkout-session-with-invoice \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "dealId": 123,
       "productName": "Test Course",
       "amount": 100
     }'
   ``` 