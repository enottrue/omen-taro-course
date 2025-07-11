# Настройка Email для SpaceWeb SMTP

## Ваши SMTP настройки

```
SMTP-сервер: smtp.spaceweb.ru
Порт: 465
Защита: SSL
Авторизация: Да
Email: support@astro-irena.com
Пароль: ZEHMQ39KF1#Y3p3G
```

## Настройка для разработки

### 1. Создайте файл `.env.local` в корне проекта:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/omen_tarot"

# JWT Secret
APP_SECRET="your-super-secret-jwt-key-here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# Email Configuration - SpaceWeb SMTP
SMTP_HOST="smtp.spaceweb.ru"
SMTP_PORT="465"
SMTP_USER="support@astro-irena.com"
SMTP_PASS="ZEHMQ39KF1#Y3p3G"
SMTP_SECURE="true"
```

### 2. Перезапустите сервер разработки:

```bash
npm run dev
```

### 3. Протестируйте отправку email:

1. Откройте приложение
2. Перейдите на форму входа
3. Нажмите "Забыли пароль?"
4. Введите email: `enottrue@gmail.com`
5. Проверьте почтовый ящик

## Настройка для продакшена

### 1. Добавьте переменные окружения на сервере:

```env
SMTP_HOST=smtp.spaceweb.ru
SMTP_PORT=465
SMTP_USER=support@astro-irena.com
SMTP_PASS=ZEHMQ39KF1#Y3p3G
SMTP_SECURE=true
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Убедитесь, что NODE_ENV=production

## Проверка работы

После настройки в консоли сервера вы должны увидеть:

```
=== SENDING REAL EMAIL (DEVELOPMENT MODE) ===
SMTP credentials found, sending real email...
Email sent successfully: <message-id>
=== END REAL EMAIL ===
```

## Отладка проблем

### Если email не отправляются:

1. **Проверьте настройки SMTP:**
   - Убедитесь, что порт 465 и SSL включен
   - Проверьте правильность email и пароля

2. **Проверьте логи сервера:**
   - Ищите ошибки подключения к SMTP
   - Проверьте ошибки аутентификации

3. **Тестовые команды:**
   ```bash
   # Проверка подключения к SMTP
   telnet smtp.spaceweb.ru 465
   ```

### Частые ошибки:

- **535 Authentication failed** - неправильный пароль
- **Connection timeout** - проблемы с сетью
- **SSL/TLS error** - проблемы с SSL сертификатом

## Безопасность

- Никогда не коммитьте `.env.local` файл
- Используйте разные пароли для разработки и продакшена
- Регулярно обновляйте пароли
- Мониторьте логи отправки email 