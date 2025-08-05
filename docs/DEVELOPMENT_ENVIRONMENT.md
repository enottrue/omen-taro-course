# 🔧 Development Environment с тестовыми ключами Stripe

## 📋 Описание

Система поддерживает использование тестовых ключей Stripe в development режиме через GET параметр `ENV=Development`. Тестовые ключи берутся из переменных окружения, что обеспечивает безопасность и соответствие требованиям GitHub.

## 🚀 Как использовать

### 1. Настройка переменных окружения

Создайте файл `.env` в корне проекта и добавьте тестовые ключи:

```env
# Test Stripe Keys (тестовые ключи для development режима)
STRIPE_TEST_SECRET_KEY=sk_test_your_test_secret_key_here
NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
STRIPE_TEST_WEBHOOK_SECRET=whsec_your_test_webhook_secret_here

# Production Stripe Keys (боевые ключи)
STRIPE_SECRET_KEY=sk_live_your_production_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret_here
```

### 2. Активация Development режима

Добавьте параметр `ENV=Development` к URL:

```
https://your-domain.com/?ENV=Development
```

### 3. Визуальная индикация

В development режиме в правом верхнем углу появится красный индикатор:

```
🔧 DEV MODE
```

## 🔄 Логика работы

### Определение окружения

```typescript
export function getEnvironment(): 'development' | 'production' {
  if (typeof window !== 'undefined') {
    // Клиентская сторона
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ENV') === 'Development' ? 'development' : 'production';
  } else {
    // Серверная сторона
    return process.env.NODE_ENV === 'development' ? 'development' : 'production';
  }
}
```

### Получение ключей из переменных окружения

```typescript
export function getStripeSecretKey(): string {
  const env = getEnvironment();
  
  if (env === 'development') {
    console.log('🔧 Using test Stripe keys for Development environment');
    const testKey = process.env.STRIPE_TEST_SECRET_KEY;
    if (!testKey) {
      throw new Error('STRIPE_TEST_SECRET_KEY not found in environment variables');
    }
    return testKey;
  }
  
  // В продакшене используем ключи из .env
  const productionKey = process.env.STRIPE_SECRET_KEY;
  if (!productionKey) {
    throw new Error('STRIPE_SECRET_KEY not found in environment variables');
  }
  
  return productionKey;
}
```

## 📊 Логирование

При запуске в development режиме в консоли отображается информация:

```
🌍 Environment: development
🔑 Stripe Secret Key (first 10 chars): sk_test_51...
🔑 Stripe Publishable Key (first 10 chars): pk_test_51...
🔧 Using test Stripe keys for Development environment
```

## 🎯 Использование в API

### Создание checkout session

```typescript
// pages/api/stripe/create-checkout-session.ts
import { getStripeSecretKey, logEnvironmentInfo } from '../../../src/utils/environment';

// Логируем информацию об окружении
logEnvironmentInfo();

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-06-30.basil',
});
```

### Webhook обработка

```typescript
// pages/api/stripe/webhook.ts
import { getStripeSecretKey, getStripeWebhookSecret, logEnvironmentInfo } from '../../../src/utils/environment';

// Логируем информацию об окружении
logEnvironmentInfo();

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-06-30.basil',
});

const webhookSecret = getStripeWebhookSecret();
```

## 🔧 Клиентская сторона

### Загрузка Stripe

```typescript
// src/utils/stripeCheckout.ts
import { getStripePublishableKey } from './environment';

const stripePromise = loadStripe(getStripePublishableKey());
```

### Компонент индикации

```typescript
// src/components/EnvironmentInfo.tsx
export const EnvironmentInfo = () => {
  const [environment, setEnvironment] = useState<string>('');

  useEffect(() => {
    const env = getEnvironment();
    setEnvironment(env);
  }, []);

  // Показываем только в development режиме
  if (environment !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#ff6b6b',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontWeight: 'bold'
    }}>
      🔧 DEV MODE
    </div>
  );
};
```

## 🧪 Тестирование

### 1. Создайте .env файл

```bash
# Создайте файл .env в корне проекта
touch .env
```

### 2. Добавьте переменные

```env
# Test Stripe Keys
STRIPE_TEST_SECRET_KEY=sk_test_your_test_secret_key_here
NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
STRIPE_TEST_WEBHOOK_SECRET=whsec_your_test_webhook_secret_here

# Production Stripe Keys (замените на ваши)
STRIPE_SECRET_KEY=sk_live_your_production_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret_here
```

### 3. Активируйте development режим

```
http://localhost:3000/?ENV=Development
```

### 4. Проверьте индикатор

В правом верхнем углу должен появиться красный индикатор "🔧 DEV MODE"

### 5. Проверьте консоль

В консоли браузера должны появиться логи:

```
🌍 Environment: development
🔑 Stripe Secret Key (first 10 chars): sk_test_51...
🔑 Stripe Publishable Key (first 10 chars): pk_test_51...
🔧 Using test Stripe keys for Development environment
```

### 6. Протестируйте платежи

Используйте тестовые карты Stripe:

- **Успешная оплата**: `4242 4242 4242 4242`
- **Неуспешная оплата**: `4000 0000 0000 0002`
- **Требует 3D Secure**: `4000 0025 0000 3155`

## ⚠️ Важные замечания

1. **Безопасность**: Тестовые ключи хранятся в `.env` файле, который не коммитится в Git
2. **Переключение**: Для переключения между режимами просто измените URL параметр
3. **Логирование**: Все операции логируются для отладки
4. **Webhook**: В development режиме используется тестовый webhook секрет
5. **GitHub**: Ключи больше не встроены в код, что соответствует требованиям GitHub

## 🚀 Развертывание

### Development режим

```bash
# Локальная разработка
npm run dev

# Откройте в браузере
http://localhost:3000/?ENV=Development
```

### Production режим

```bash
# Продакшн сборка
npm run build
npm start

# Используются ключи из .env
```

## 📋 Примеры URL

```
# Development режим
https://your-domain.com/?ENV=Development

# Production режим (по умолчанию)
https://your-domain.com/
https://your-domain.com/?ENV=Production
```

## 🔍 Устранение неполадок

### Ошибка "STRIPE_TEST_SECRET_KEY not found"

1. Проверьте, что файл `.env` существует
2. Убедитесь, что переменная `STRIPE_TEST_SECRET_KEY` добавлена
3. Перезапустите приложение

### Ошибка "STRIPE_SECRET_KEY not found"

1. Добавьте боевые ключи в `.env` файл
2. Убедитесь, что переменные названы правильно
3. Проверьте права доступа к файлу

### Индикатор не появляется

1. Проверьте URL параметр: `?ENV=Development`
2. Убедитесь, что компонент `EnvironmentInfo` добавлен на страницу
3. Проверьте консоль на ошибки JavaScript 