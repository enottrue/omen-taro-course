# 🚀 Быстрая настройка Stripe Webhook

## 1. Текущий ngrok URL
```
https://63093f6681f0.ngrok-free.app
```

## 2. Webhook URL для Stripe
```
https://63093f6681f0.ngrok-free.app/api/stripe/webhook
```

## 3. Настройка в Stripe Dashboard
1. Перейдите: https://dashboard.stripe.com/webhooks
2. Нажмите "Add endpoint"
3. Введите URL выше
4. Выберите события:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## 4. Добавьте в .env.local
```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 5. Запустите сервер
```bash
npm run dev
```

## 6. Тестирование
После настройки webhook'а в Stripe, создайте тестовый платеж и проверьте логи сервера.

✅ Готово! Webhook будет автоматически обновлять `isPaid: true` для пользователей после успешной оплаты. 