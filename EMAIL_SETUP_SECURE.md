# Настройка Email (Безопасная версия)

## Важные замечания по безопасности

⚠️ **НИКОГДА не коммитьте реальные пароли и учетные данные в Git!**

## Настройка переменных окружения

Создайте файл `.env.local` в корне проекта и добавьте следующие переменные:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

## Настройка Gmail SMTP

1. Включите двухфакторную аутентификацию в Google аккаунте
2. Создайте пароль приложения:
   - Перейдите в настройки безопасности Google
   - Выберите "Пароли приложений"
   - Создайте новый пароль для "Почта"
3. Используйте этот пароль в `SMTP_PASS`

## Альтернативные SMTP провайдеры

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_SECURE=false
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
SMTP_SECURE=false
```

### Yandex
```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=your-email@yandex.ru
SMTP_PASS=your-app-password
SMTP_SECURE=true
```

## Проверка настройки

После настройки переменных окружения:

1. Перезапустите сервер разработки
2. Проверьте логи - должно появиться сообщение "Email service is ready"
3. Протестируйте отправку email через функцию восстановления пароля

## Безопасность

- ✅ Используйте переменные окружения
- ✅ Добавьте `.env.local` в `.gitignore`
- ❌ Не коммитьте реальные пароли
- ❌ Не используйте хардкодированные значения

## Устранение неполадок

### Ошибка аутентификации
- Проверьте правильность email и пароля
- Убедитесь, что двухфакторная аутентификация включена
- Используйте пароль приложения, а не основной пароль

### Ошибка подключения
- Проверьте правильность SMTP_HOST и SMTP_PORT
- Убедитесь, что SMTP_SECURE соответствует порту
- Проверьте настройки файрвола

### Email не отправляется
- Проверьте логи сервера
- Убедитесь, что SMTP настройки корректны
- В development режиме email может выводиться только в консоль 