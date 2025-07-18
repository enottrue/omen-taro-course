/**
 * Stage status utilities for managing stage progress
 */

export const STAGE_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
  PAUSED: 'paused'
} as const;

export type StageStatus = typeof STAGE_STATUSES[keyof typeof STAGE_STATUSES];

/**
 * Get the current stage status from stageStatuses array
 * @param stageStatuses - Array of stage status objects
 * @returns The current status or 'new' if not found
 */
export const getStageStatus = (stageStatuses: any[]): StageStatus => {
  if (!stageStatuses || stageStatuses.length === 0) {
    return STAGE_STATUSES.NEW;
  }
  return stageStatuses[0]?.status || STAGE_STATUSES.NEW;
};

/**
 * Check if stage is finished
 * @param stageStatuses - Array of stage status objects
 * @returns True if stage is finished
 */
export const isStageFinished = (stageStatuses: any[]): boolean => {
  return getStageStatus(stageStatuses) === STAGE_STATUSES.FINISHED;
};

/**
 * Check if stage is in progress
 * @param stageStatuses - Array of stage status objects
 * @returns True if stage is in progress
 */
export const isStageInProgress = (stageStatuses: any[]): boolean => {
  return getStageStatus(stageStatuses) === STAGE_STATUSES.IN_PROGRESS;
};

/**
 * Check if stage is paused
 * @param stageStatuses - Array of stage status objects
 * @returns True if stage is paused
 */
export const isStagePaused = (stageStatuses: any[]): boolean => {
  return getStageStatus(stageStatuses) === STAGE_STATUSES.PAUSED;
};

/**
 * Check if stage is new (not started)
 * @param stageStatuses - Array of stage status objects
 * @returns True if stage is new
 */
export const isStageNew = (stageStatuses: any[]): boolean => {
  return getStageStatus(stageStatuses) === STAGE_STATUSES.NEW;
};

/**
 * Get CSS class for stage status
 * @param stageStatuses - Array of stage status objects
 * @returns CSS class name for the status
 */
export const getStageStatusClass = (stageStatuses: any[]): string => {
  const status = getStageStatus(stageStatuses);
  
  switch (status) {
    case STAGE_STATUSES.FINISHED:
      return 'cource-lessons__item-content-list-item_completed';
    case STAGE_STATUSES.PAUSED:
      return 'cource-lessons__item-content-list-item_paused';
    case STAGE_STATUSES.IN_PROGRESS:
      return 'cource-lessons__item-content-list-item_in-progress';
    default:
      return '';
  }
}; 