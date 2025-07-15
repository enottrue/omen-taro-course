# Система оплаты и контроля доступа

## Обзор

Система реализует контроль доступа на основе статуса оплаты пользователя. Неоплаченные пользователи перенаправляются на главную страницу, а оплаченные получают доступ ко всем материалам курса.

## Архитектура

### 1. База данных
- Поле `isPaid` в таблице `User` (Boolean, по умолчанию false)
- Поле `paymentDate` для отслеживания даты оплаты
- Поле `stripeSessionId` для связи с Stripe

### 2. Middleware
Файл `middleware.ts` проверяет статус оплаты для защищенных страниц:
- `/courses` - страница курсов
- `/course_book` - книга курса  
- `/lesson` - уроки
- `/onboarding` - онбординг

### 3. API Endpoints
- `GET /api/users/[id]` - получение данных пользователя
- `POST /api/users/update-payment` - обновление статуса оплаты
- `POST /api/stripe/create-checkout-session` - создание сессии оплаты
- `POST /api/stripe/webhook` - обработка webhook'ов от Stripe

## Компоненты

### PaymentStatus
Компонент для отображения и управления статусом оплаты:
- Административный интерфейс для изменения статуса
- Пользовательский интерфейс с кнопкой оплаты
- Интеграция с Stripe для обработки платежей

### PaymentRequired
Компонент для отображения страницы ограничения доступа:
- Информация о необходимости оплаты
- Кнопка для перехода к оплате
- Список преимуществ курса

## Логика работы

### 1. Проверка авторизации
```typescript
// В middleware.ts
if (cookies.Bearer) {
  // Проверяем валидность токена
  const isValid = jws.JWS.verifyJWT(cookies.Bearer, APP_SECRET, {
    alg: ['HS256'],
  });
}
```

### 2. Проверка статуса оплаты
```typescript
// Для защищенных страниц
if (isPaidOnlyPage && cookies.userId) {
  const userResponse = await fetch(`/api/users/${cookies.userId}`);
  const userData = await userResponse.json();
  
  if (!userData.user.isPaid) {
    // Перенаправляем на главную
    return NextResponse.redirect(url, { status: 302 });
  }
}
```

### 3. Отображение компонентов
```typescript
// На защищенных страницах
if (showPaymentRequired) {
  return <PaymentRequired />;
}
```

## Интеграция со Stripe

### 1. Создание сессии оплаты
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Cosmo Course',
        description: 'Personalized financial astrology course',
      },
      unit_amount: 5000, // $50.00
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/payment/cancel`,
  customer_email: email,
  metadata: { email, product: 'cosmo_course' },
});
```

### 2. Обработка webhook'ов
```typescript
case 'checkout.session.completed':
  await prisma.user.updateMany({
    where: { email: session.metadata?.email },
    data: {
      isPaid: true,
      paymentDate: new Date(),
      stripeSessionId: session.id,
    },
  });
```

## Тестирование

### Тестовая страница
Доступна по адресу `/payment-test` для проверки:
- Статуса оплаты пользователя
- Работы компонентов PaymentStatus и PaymentRequired
- Интеграции с Stripe

### Ручное тестирование
1. Создайте пользователя через регистрацию
2. Проверьте, что `isPaid = false` по умолчанию
3. Попробуйте зайти на `/courses` - должно перенаправить на главную
4. Измените статус через API или компонент PaymentStatus
5. Проверьте доступ к защищенным страницам

## Безопасность

### 1. Middleware проверки
- Все запросы к защищенным страницам проходят через middleware
- Проверка валидности JWT токена
- Проверка статуса оплаты в базе данных

### 2. Server-side проверки
- `getServerSideProps` получает данные пользователя на сервере
- Проверка статуса оплаты перед рендерингом страницы

### 3. Client-side компоненты
- Дополнительная проверка на клиенте
- Graceful fallback при ошибках

## Настройка

### Переменные окружения
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_SECRET=your_jwt_secret
```

### Конфигурация Stripe
1. Создайте аккаунт в Stripe
2. Получите API ключи
3. Настройте webhook endpoint
4. Добавьте переменные окружения

## Мониторинг

### Логи
- Все операции с оплатой логируются
- Ошибки webhook'ов отслеживаются
- Попытки доступа к защищенным страницам без оплаты

### Метрики
- Количество успешных оплат
- Конверсия из регистрации в оплату
- Популярность различных страниц курса 