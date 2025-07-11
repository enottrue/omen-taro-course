# Настройка Email для восстановления пароля

## Для разработки (Development)

### Вариант 1: Только логирование в консоль (по умолчанию)
В режиме разработки email не отправляется, а только выводится в консоль. Это безопасно и удобно для тестирования.

### Вариант 2: Реальная отправка email в development
Если вы хотите тестировать реальную отправку email в development режиме:

1. **Настройте SMTP** (см. инструкции ниже)
2. **Добавьте переменные окружения** в `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

3. **Перезапустите сервер** - email сервис автоматически определит настройки и будет отправлять реальные email

## Для продакшена (Production)

### 1. Настройка Gmail SMTP

1. Включите двухфакторную аутентификацию в Google аккаунте
2. Создайте пароль приложения:
   - Перейдите в настройки безопасности Google
   - Найдите "Пароли приложений"
   - Создайте новый пароль для "Почта"
3. Добавьте переменные окружения в `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Альтернативные SMTP провайдеры

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### 3. Проверка настройки

После настройки email сервис автоматически:
- **В development без SMTP**: выводит email в консоль
- **В development с SMTP**: отправляет реальные email
- **В production**: всегда отправляет реальные email

### 4. Тестирование

1. Запустите приложение
2. Перейдите на форму входа
3. Нажмите "Забыли пароль?"
4. Введите email
5. Проверьте:
   - **Без SMTP**: консоль браузера
   - **С SMTP**: почтовый ящик

## Безопасность

- Никогда не коммитьте `.env.local` файл
- Используйте разные email для разработки и продакшена
- Регулярно обновляйте пароли приложений
- Мониторьте логи отправки email

## Отладка

Если email не отправляются:
1. Проверьте SMTP настройки
2. Убедитесь, что APP_SECRET настроен
3. Проверьте логи сервера на ошибки
4. Убедитесь, что email адрес корректный 