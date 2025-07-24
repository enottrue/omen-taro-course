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

## 🚀 Deployment Guide

### Prerequisites

- Node.js 18.17.0 or higher
- PostgreSQL database
- Docker (optional, for local development)

### Sequential Deployment Steps

#### 1. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/omen_taro_db"

# App Secret (generate a secure random string)
APP_SECRET="your-secure-app-secret-here"

# Video URLs (optional - for custom video hosting)
NEXT_PUBLIC_VIDEO_URL="https://your-video-domain.com/videos"
NEXT_PUBLIC_PREVIEW_URL="https://your-preview-domain.com/preview"

# Stripe (for payment processing)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Bitrix24 (for CRM integration)
BITRIX24_WEBHOOK_URL="https://your-domain.bitrix24.ru/rest/1/webhook_key/"
```

#### 2. Database Setup

**Option A: Using Docker (Recommended for development)**

```bash
# Start PostgreSQL container
docker-compose up -d

# Or for development environment
docker-compose -f docker-compose.dev.yaml up -d
```

**Option B: Local PostgreSQL Installation**

1. Install PostgreSQL on your system
2. Create a new database: `createdb omen_taro_db`
3. Update the `DATABASE_URL` in your `.env` file

#### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Verify migrations
npx prisma migrate status
```

#### 5. Seed Database

Populate the database with initial data (courses, lessons, stages, users, tools):

```bash
# Run the seed script
npx ts-node src/lib/prisma/seed.ts
```

**Note:** The seed file contains current production data including:
- 1 course
- 6 lessons (including the new Bonus Module)
- 22 stages with homework assignments
- 80 stage timecodes
- Default tools and user data

#### 6. Build and Start Application

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Development Workflow

#### Adding New Content

When adding new lessons, stages, or other content:

1. **Update the database** through the application or direct database operations
2. **Dump current data** to keep seed file updated:
   ```bash
   node dump-database.js
   ```
3. **Update seed file** with new data from `current-database-export.json`
4. **Test locally** before deploying

#### Database Migrations

When making schema changes:

```bash
# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations in production
npx prisma migrate deploy
```

### Production Deployment

#### Environment Variables for Production

Ensure all production environment variables are properly configured:

- `DATABASE_URL` - Production PostgreSQL connection string
- `APP_SECRET` - Secure random string for JWT signing
- `STRIPE_SECRET_KEY` - Production Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Production Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret

#### Deployment Platforms

**Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

**Docker Deployment**
```bash
# Build Docker image
docker build -t omen-taro-course .

# Run container
docker run -p 3000:3000 --env-file .env omen-taro-course
```

### Verification Steps

After deployment, verify:

1. **Database Connection**: Check that the application can connect to the database
2. **Seed Data**: Verify that all courses, lessons, and stages are loaded
3. **Video Playback**: Test video player functionality
4. **Payment System**: Test Stripe integration (use test keys)
5. **Authentication**: Verify user registration and login
6. **Middleware**: Check that static files are served correctly without middleware interference

### Troubleshooting

#### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` format
   - Check database server is running
   - Ensure database exists

2. **Migration Errors**
   - Run `npx prisma migrate reset` to reset database
   - Check migration files for syntax errors

3. **Seed Data Issues**
   - Verify `currentDatabaseData.ts` file exists
   - Check for TypeScript compilation errors
   - Ensure all required data is present

4. **Video Playback Issues**
   - Check video file paths
   - Verify CORS settings for video hosting
   - Test with different browsers

#### Debug Tools

Use the provided debug scripts in the root directory:
- `check-paid-users.js` - Check user payment status
- `debug-users.js` - Debug user data
- `dump-database.js` - Export current database state

## 📚 Документация

- [🛠️ Инструменты отладки](DEBUG_TOOLS.md) - Скрипты для диагностики и управления системой оплаты
- [💳 Система оплаты](PAYMENT_SYSTEM.md) - Документация по интеграции со Stripe
- [🔗 Интеграция с Битрикс24](BITRIX24_INTEGRATION.md) - Настройка CRM интеграции
- [🌱 Обновление данных для деплоя](CURRENT_SEED_DATA_UPDATE.md) - Инструкции по обновлению seed файла
- [✅ Отчет о завершении обновления](SEED_UPDATE_COMPLETION_REPORT.md) - Детальный отчет о последнем обновлении

## Configuring database in docker

It expects to be used with Postgresql in docker. Please, change .env path to database.

Keep going with NextJS 13.
