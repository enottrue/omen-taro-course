# Stage Status Unification

## Overview
All stage statuses have been unified to use consistent values throughout the application.

## Status Values

### Available Statuses
- `'new'` - Stage not started (default)
- `'in_progress'` - Stage in progress
- `'finished'` - Stage completed
- `'paused'` - Stage paused

### Migration Results
- ✅ `'completed'` → `'finished'` (1 record updated)
- ✅ All new records use `'finished'` for completion
- ✅ Consistent status values across all components

## Usage

### 1. In Components
```typescript
import { 
  STAGE_STATUSES, 
  isStageFinished, 
  getStageStatusClass 
} from '@/utils/stageStatusUtils';

// Check if stage is finished
const isFinished = isStageFinished(stage.stageStatuses);

// Get CSS class for status
const statusClass = getStageStatusClass(stage.stageStatuses);
```

### 2. In GraphQL Resolvers
```typescript
import { STAGE_STATUSES } from '@/utils/stageStatusUtils';

// Create new stage status
await prisma.stageStatus.create({
  data: {
    stageId: stageId,
    userId: userId,
    status: STAGE_STATUSES.NEW,
  },
});

// Update to finished
await prisma.stageStatus.update({
  where: { id: stageStatusId },
  data: { status: STAGE_STATUSES.FINISHED },
});
```

### 3. In Mutations
```typescript
const [changeStageStatus] = useMutation(CHANGE_STAGE_STATUS);

changeStageStatus({
  variables: {
    stageId: Number(stageId),
    userId: Number(userId),
    status: STAGE_STATUSES.FINISHED,
  },
});
```

## Benefits

1. **Consistency**: All components use the same status values
2. **Type Safety**: TypeScript enforces correct status values
3. **Maintainability**: Single source of truth for status constants
4. **Readability**: Clear, descriptive status names
5. **Extensibility**: Easy to add new statuses in the future

## Files Updated

### New Files
- `src/utils/stageStatusUtils.ts` - Status utilities and constants
- `update-stage-statuses.js` - Migration script
- `STAGE_STATUS_UNIFICATION.md` - This documentation

### Modified Files
- `src/graphql/resolvers.tsx` - Uses STAGE_STATUSES constants
- `src/components/lesson_header/lessonHeader.tsx` - Uses STAGE_STATUSES constants
- `src/components/course_list_item/courseListItem.tsx` - Uses status utilities
- `src/lib/prisma/seed.ts` - Added STAGE_STATUSES import and documentation

## Database Migration

The migration script `update-stage-statuses.js` was run to update existing data:
- 1 record updated from `'completed'` to `'finished'`
- Current distribution: `new` (12), `in_progress` (1), `finished` (1)

## Future Considerations

1. **Add Progress Tracking**: Consider adding `'in_progress'` status when user starts watching
2. **Pause Functionality**: Implement `'paused'` status for video pause events
3. **Status Transitions**: Add validation for valid status transitions
4. **Analytics**: Track status changes for user behavior analysis 