# New Seed Data Implementation

## Overview
We have successfully updated the seed data to use actual data from the `dumps` folder instead of the old hardcoded data. This ensures that the database is populated with real, up-to-date information.

## New Files Created

### 1. `src/lib/dump-data/newLessonsData.tsx`
- **Purpose**: Contains actual course, lesson, and stage data from dumps
- **Contents**:
  - `coursesData`: 1 course - "Обучающий курс по Таро для колоды карт таро Omen"
  - `lessonsData`: 5 lessons with proper structure
  - `stageData`: 4 stages with detailed timecodes and descriptions

### 2. `src/lib/dump-data/newUserData.tsx`
- **Purpose**: Contains actual user data from dumps
- **Contents**: 6 users with real email addresses, payment statuses, and Bitrix24 integration data

### 3. `src/lib/dump-data/newToolsData.tsx`
- **Purpose**: Contains actual tools data from dumps
- **Contents**: 11 development tools with proper descriptions and links

## Updated Files

### `src/lib/prisma/seed.ts`
- **Changes**: Updated imports to use new data files
- **Imports**:
  ```typescript
  import tools from '../dump-data/newToolsData';
  import users from '../dump-data/newUserData';
  import { lessonsData, coursesData, stageData } from '../dump-data/newLessonsData';
  ```

## Data Structure

### Courses
- ID: 1
- Name: "Обучающий курс по Таро для колоды карт таро Omen"

### Lessons (5 total)
1. "История создания колоды"
2. "Ритуальная подготовка к работе с Таро"
3. "Значения Арканов. Старшие Арканы"
4. "Значения Арканов. Младшие Арканы"
5. "Коллекция раскладов"

### Stages (4 total)
1. "История создания колоды Таро Уэйта" (Lesson 1, Stage 1)
2. "Преимущества работы с Таро" (Lesson 1, Stage 2)
3. "Ритуальное Таро Памелы Смит и магическое искусство Викка" (Lesson 1, Stage 3)
4. "Ритуальная подготовка к работе с Таро" (Lesson 2, Stage 1)

### Users (6 total)
- Real email addresses and phone numbers
- Various payment statuses (paid/unpaid)
- Bitrix24 integration data
- Proper password hashes

### Tools (11 total)
- Development tools like TypeScript, React Hook Forms, GraphQL, etc.
- Proper descriptions and links
- Correct image paths

## Benefits

1. **Real Data**: Database now contains actual production-like data
2. **Consistency**: Data matches what's in the dumps folder
3. **Testing**: Better testing environment with realistic data
4. **Development**: Developers can work with real data structure

## Usage

To seed the database with new data:
```bash
npx prisma db seed
```

The seed process will:
1. Clear existing data
2. Add tools (11 items)
3. Add users (6 items)
4. Add courses (1 item)
5. Add lessons (5 items)
6. Add stages and timecodes (4 stages with detailed timecodes)

## Notes

- StageStatus records are created dynamically upon user registration
- All timestamps are preserved from the original dumps
- Foreign key relationships are maintained
- Data integrity is ensured through proper ID sequences 