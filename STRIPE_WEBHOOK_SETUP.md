# Настройка Stripe Webhook с ngrok

## Текущий ngrok URL
Ваш публичный URL: `https://63093f6681f0.ngrok-free.app`

## Шаг 1: Настройка Stripe Webhook

1. Перейдите в [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Нажмите "Add endpoint"
3. Введите URL: `https://63093f6681f0.ngrok-free.app/api/stripe/webhook`
4. Выберите события для отслеживания:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## Шаг 2: Получение Webhook Secret

После создания webhook'а Stripe даст вам **Webhook Secret**. Добавьте его в ваш `.env.local`:

```bash
# Добавьте в .env.local:
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Шаг 3: Проверка работы webhook'а

1. Запустите ваш сервер: `npm run dev`
2. Создайте тестовый платеж в Stripe
3. Проверьте логи сервера - должен появиться лог о успешной обработке webhook'а

## Шаг 4: Обновление статуса пользователя

После успешной оплаты webhook автоматически:
- Обновит `isPaid: true` для пользователя
- Установит `paymentDate` с текущей датой
- Сохранит `stripeSessionId`

## Важные замечания

- ngrok URL меняется при каждом перезапуске ngrok
- Для продакшена используйте постоянный домен
- Webhook secret должен быть добавлен в переменные окружения
- Убедитесь, что сервер запущен при тестировании webhook'ов 