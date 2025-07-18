# Course Configuration

## Overview
The system now uses a centralized approach for managing course IDs through environment variables.

## Environment Variables

### COURSE_ID
- **Purpose**: Defines the default course ID used throughout the application
- **Type**: String (numeric)
- **Default**: `7`
- **Example**: `COURSE_ID=7`

## Usage

### 1. Set Environment Variable
Add to your `.env` file:
```env
COURSE_ID=7
```

### 2. In Server-Side Code (getServerSideProps)
```typescript
import { getDefaultCourseIdString } from '@/utils/courseUtils';

const { data } = await apolloClient.query({
  query: GET_COURSE,
  variables: {
    id: getDefaultCourseIdString(), // Uses COURSE_ID from environment
    userId: userId ? Number(userId) : 1,
  },
});
```

### 3. In GraphQL Resolvers
```typescript
import { getDefaultCourseIdString } from '@/utils/courseUtils';

getCourse: async (parent, args: { id?: string; userId: string }) => {
  const courseId = args.id || getDefaultCourseIdString();
  // ... rest of resolver
}
```

### 4. In Components
```typescript
import { getDefaultCourseIdString } from '@/utils/courseUtils';

// Use in client-side components if needed
const courseId = getDefaultCourseIdString();
```

## Benefits

1. **Centralized Configuration**: All course references use the same ID
2. **Environment Flexibility**: Easy to switch between different courses
3. **Default Fallback**: System works even without environment variable
4. **Type Safety**: Utility functions provide proper typing
5. **Maintainability**: Single source of truth for course ID

## Migration

### Before
```typescript
// Hardcoded course ID
id: 7
```

### After
```typescript
// Environment-based course ID
id: getDefaultCourseIdString()
```

## Files Updated

- `src/utils/courseUtils.ts` - New utility functions
- `src/graphql/resolvers.tsx` - Updated getCourse resolver
- `src/graphql/schema.ts` - Made course ID optional
- `pages/courses.tsx` - Uses environment variable
- `pages/course_book.tsx` - Uses environment variable
- `src/components/course_lessons/courseLessons.tsx` - Imported utility

## Validation

The system includes validation to ensure course IDs are valid:
```typescript
import { isValidCourseId } from '@/utils/courseUtils';

if (!isValidCourseId(courseId)) {
  throw new Error('Invalid course ID');
}
``` 