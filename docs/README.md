NextJS 13 with linting, pretting, VSCode props and TS, husky configured template for production ready projects. The project was bootstrapped from create-next-app

## Getting Started

The project requires Node 18.17.0 version. Feel free to use nvm use 18.17.0 to make it work.

First, run the development server:

```bash
npm run dev
# or
nvm use 18.17.0 && yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Configuring database in docker

It expects to be used with Postgresql in docker. Please, change .env path to database.

Keep going with NextJS 13.

# omen-nextjs

## 📚 Документация

- [🛠️ Инструменты отладки](DEBUG_TOOLS.md) - Скрипты для диагностики и управления системой оплаты
- [💳 Система оплаты](PAYMENT_SYSTEM.md) - Документация по интеграции со Stripe
- [🔗 Интеграция с Битрикс24](BITRIX24_INTEGRATION.md) - Настройка CRM интеграции
