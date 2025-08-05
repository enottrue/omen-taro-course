// Утилита для определения окружения и получения ключей Stripe

// Функция для определения окружения
export function getEnvironment(): 'development' | 'production' {
  if (typeof window !== 'undefined') {
    // Клиентская сторона
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ENV') === 'Development' ? 'development' : 'production';
  } else {
    // Серверная сторона - проверяем URL параметр из запроса
    // Если нет доступа к URL параметрам, используем NODE_ENV как fallback
    return process.env.NODE_ENV === 'development' ? 'development' : 'production';
  }
}

// Функция для получения секретного ключа Stripe
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

// Функция для получения публичного ключа Stripe
export function getStripePublishableKey(): string {
  const env = getEnvironment();
  
  if (env === 'development') {
    const testKey = process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;
    if (!testKey) {
      throw new Error('NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY not found in environment variables');
    }
    return testKey;
  }
  
  // В продакшене используем ключи из .env
  const productionKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!productionKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in environment variables');
  }
  
  return productionKey;
}

// Функция для получения webhook секрета
export function getStripeWebhookSecret(): string {
  const env = getEnvironment();
  
  if (env === 'development') {
    const testSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET;
    if (!testSecret) {
      throw new Error('STRIPE_TEST_WEBHOOK_SECRET not found in environment variables');
    }
    return testSecret;
  }
  
  // В продакшене используем ключи из .env
  const productionSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!productionSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not found in environment variables');
  }
  
  return productionSecret;
}

// Функция для логирования информации об окружении
export function logEnvironmentInfo(): void {
  const env = getEnvironment();
  console.log(`🌍 Environment: ${env}`);
  console.log(`🔑 Stripe Secret Key (first 10 chars): ${getStripeSecretKey().substring(0, 10)}...`);
  console.log(`🔑 Stripe Publishable Key (first 10 chars): ${getStripePublishableKey().substring(0, 10)}...`);
} 