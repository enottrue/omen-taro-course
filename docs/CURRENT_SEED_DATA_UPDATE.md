# Обновление Seed файла с актуальными данными

## Описание изменений

Seed файл был обновлен для использования актуальных данных из текущей базы данных, включая новый бонусный модуль и все связанные с ним данные.

## Что было обновлено

### 1. Новые файлы данных
- **`src/lib/dump-data/currentDatabaseData.ts`** - содержит актуальные данные из базы данных

### 2. Обновленный seed файл
- **`src/lib/prisma/seed.ts`** - теперь использует актуальные данные вместо старых

## Структура данных

### Курсы (1 курс)
- **Money Compass - Astrology Course for Financial Success** (ID: 1)

### Уроки (6 уроков)
1. **Module 1 - Introduction to the Birth Chart** (ID: 1, lessonNumber: 1)
2. **Module 2 - Dream Job & High-Income Careers** (ID: 2, lessonNumber: 2)
3. **Module 3 - Money Energy** (ID: 3, lessonNumber: 3)
4. **Module 4 - Quick Cash Strategies** (ID: 4, lessonNumber: 4)
5. **Module 5 - Avoiding Burnout & Loving What You Do** (ID: 5, lessonNumber: 5)
6. **Bonus Module: Annual Financial Forecast** (ID: 36, lessonNumber: 6) - **НОВЫЙ**

### Этапы (8 этапов)
1. **Lesson 1 - The Basics** (ID: 1, stageNumber: 1, lessonId: 1)
2. **Lesson 2 - Discover Your Most Lucrative Career Paths** (ID: 2, stageNumber: 2, lessonId: 2)
3. **Lesson 3 - How to Land a High-Paying Job** (ID: 3, stageNumber: 3, lessonId: 2)
4. **Lesson 4 - Practical Steps to Activate Wealth Flow** (ID: 4, stageNumber: 4, lessonId: 3)
5. **Lesson 5 - Smart Money Management & Growing Your Capital** (ID: 5, stageNumber: 5, lessonId: 3)
6. **Lesson 6 - Pinpointing Quick-Income Opportunities** (ID: 6, stageNumber: 6, lessonId: 4)
7. **Lesson 7 - Creating a Work Environment** (ID: 7, stageNumber: 7, lessonId: 5)
8. **Lesson 8: Astrological Money Forecast** (ID: 22, stageNumber: 8, lessonId: 36) - **НОВЫЙ**

### Пользователи (9 пользователей)
- Все существующие пользователи с их актуальными данными
- Включая статусы оплаты, Bitrix24 интеграции и Stripe сессии

### Инструменты (11 инструментов)
- Все существующие инструменты разработки

### Таймкоды
- Полные таймкоды для всех этапов (86 таймкодов)
- Включая новые таймкоды для бонусного модуля

## Особенности нового бонусного модуля

### Lesson 8: Astrological Money Forecast for the Upcoming Year
- **ID этапа**: 22
- **ID урока**: 36
- **Номер урока**: 6
- **Номер этапа**: 8
- **Описание**: Персональный финансовый прогноз на основе астрологии
- **Домашнее задание**: Включено
- **Таймкоды**: 7 таймкодов

## Как использовать

### 1. Запуск seed
```bash
npx prisma db seed
```

### 2. Проверка данных
После запуска seed файла база данных будет содержать:
- 1 курс
- 6 уроков (включая новый бонусный модуль)
- 8 этапов (включая новый этап)
- 9 пользователей
- 11 инструментов
- 86 таймкодов

### 3. Статусы этапов
Статусы этапов создаются автоматически при регистрации новых пользователей со статусом `new`.

## Важные замечания

1. **ID уроков**: Обратите внимание, что новый бонусный модуль имеет ID 36, а не 6
2. **URL структура**: Для корректной работы ссылок используется `lessonId`, а не `lessonNumber`
3. **Статусы**: Статусы этапов создаются динамически для новых пользователей
4. **Домашние задания**: Все этапы включают поле `homework` (опциональное)

## Миграция

При деплое на новую среду:
1. Запустите миграции: `npx prisma migrate deploy`
2. Запустите seed: `npx prisma db seed`
3. Проверьте, что все данные загружены корректно

## Проверка корректности

После seed можно проверить данные:
```sql
SELECT COUNT(*) FROM "Course"; -- Должно быть 1
SELECT COUNT(*) FROM "Lesson"; -- Должно быть 6
SELECT COUNT(*) FROM "Stage"; -- Должно быть 8
SELECT COUNT(*) FROM "StageTimecode"; -- Должно быть 86
SELECT COUNT(*) FROM "User"; -- Должно быть 9
SELECT COUNT(*) FROM "Tool"; -- Должно быть 11
``` 