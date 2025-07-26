# 🌟 Omen Taro Course

**Next.js-приложение с базой PostgreSQL, Prisma ORM и готовностью к продакшн-деплою через Docker и Traefik.**

---

## 📦 Содержание

- [Описание проекта](#описание-проекта)
- [Требования](#требования)
- [Переменные окружения](#переменные-окружения)
- [Базовая структура](#базовая-структура)
- [Инструкция запуска](#инструкция-запуска)
  - [1. Инициализация базы данных (миграции + сид)](#1-инициализация-базы-данных-миграции--сид)
  - [2. Запуск продакшн-сервера](#2-запуск-продакшн-сервера)
- [Traefik Reverse Proxy](#traefik-reverse-proxy)
- [Лицензия](#лицензия)

---

## 📖 Описание проекта

Omen Taro Course — это обучающая платформа, разработанная с использованием **Next.js 14**, **Prisma ORM**, **PostgreSQL** и деплоем через **Docker**. Для маршрутизации трафика используется **Traefik**.

---

## ⚙️ Требования

- Docker `>= 24.x`
- Docker Compose `>= 2.20`
- Внешняя сеть Docker `public` с Traefik
- Файл с паролем к PostgreSQL: `/home/app/.pg_password`

---

## 🧩 Переменные окружения

Файл `.env`, лежащий в корне проекта:

```ini
DATABASE_URL=postgresql://appuser:yourpassword@db:5432/omen_taro_course
NEXT_PUBLIC_API_URL=https://astro-irena.com/api
# Добавь другие переменные по необходимости



omen-taro-course/
├── .env                       # Переменные окружения
├── Dockerfile                # Инструкция сборки
├── docker-compose.yml        # Старт всех сервисов
├── project_repo/             # Исходный код приложения
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   ├── public/
│   └── ...


 Инструкция запуска

✅ 1. Инициализация базы данных (миграции + сид)

Запускается один раз или после сброса БД.
```docker compose -f docker-compose.yml \
  run --rm \
  -e APP_MODE=init \
  --env-file /home/app/omen-taro-course/.env \
  omen-taro-course
```
  Что происходит:
	•	Применяются все .sql миграции через prisma migrate deploy
	•	Запускается сидинг: ts-node src/lib/prisma/seed.ts
	•	После — стартует Next.js сервер

⸻

🟢 2. Запуск продакшн-сервера

Используется при обычной работе приложения.

```docker compose up -d omen-taro-course```

