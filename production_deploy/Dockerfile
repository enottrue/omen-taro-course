# ==== Базовый слой Node.js ====
FROM node:20-alpine AS base

# ==== Установка зависимостей ====
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY project_repo/package*.json ./
RUN npm install --legacy-peer-deps

# ==== Сборка приложения и Prisma ====
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Копируем всё из project_repo внутрь /app
COPY project_repo/ ./

# Генерация Prisma и билд Next.js
RUN npx prisma generate
RUN npm run build

# ==== Финальный production слой ====
FROM base AS runner
WORKDIR /app

# Добавим необходимые пакеты
RUN apk add --no-cache openssl \
 && npm install -g prisma ts-node

# Копируем ВСЁ из builder (грубо, но надёжно)
COPY --from=builder /app ./

# Среда
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV PATH="./node_modules/.bin:$PATH"

# Безопасный пользователь
# Создание безопасного пользователя
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# ==== Миграции, сид, запуск ====
ARG APP_MODE=default
ENV APP_MODE=${APP_MODE}

# CMD с логикой: если APP_MODE=init → миграция+сид+старт, иначе просто next start
CMD if [ "$APP_MODE" = "init" ]; then \
      echo "🛠 Running migrations and seed..." && \
      npx prisma migrate deploy && \
      ts-node --compiler-options '{"module":"CommonJS"}' src/lib/prisma/seed.ts && \
      echo "🚀 Starting server..." && \
      next start ; \
    else \
      echo "🚀 Starting server only..." && \
      next start ; \
    fi