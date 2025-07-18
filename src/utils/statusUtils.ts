// Utility functions for checking completion status of stages and lessons

export interface Stage {
  id: number;
  stageName: string;
  stageStatus?: string;
  // Add other stage properties as needed
}

export interface Lesson {
  id: number;
  lessonName: string;
  lessonStages?: Stage[];
  // Add other lesson properties as needed
}

/**
 * Check if a stage is finished
 * @param stage - The stage object
 * @returns boolean - true if stage status is 'finished'
 */
export const isStageFinished = (stage: Stage): boolean => {
  return stage.stageStatus === 'finished';
};

/**
 * Check if all stages in a lesson are finished
 * @param lesson - The lesson object with stages
 * @returns boolean - true if all stages are finished
 */
export const isLessonFinished = (lesson: Lesson): boolean => {
  if (!lesson.lessonStages || lesson.lessonStages.length === 0) {
    return false;
  }
  
  return lesson.lessonStages.every(isStageFinished);
};

/**
 * Get completion percentage for a lesson
 * @param lesson - The lesson object with stages
 * @returns number - percentage of completed stages (0-100)
 */
export const getLessonCompletionPercentage = (lesson: Lesson): number => {
  if (!lesson.lessonStages || lesson.lessonStages.length === 0) {
    return 0;
  }
  
  const completedStages = lesson.lessonStages.filter(isStageFinished).length;
  return Math.round((completedStages / lesson.lessonStages.length) * 100);
};

/**
 * Get completion percentage for all lessons
 * @param lessons - Array of lesson objects
 * @returns number - percentage of completed lessons (0-100)
 */
export const getOverallCompletionPercentage = (lessons: Lesson[]): number => {
  if (!lessons || lessons.length === 0) {
    return 0;
  }
  
  const completedLessons = lessons.filter(isLessonFinished).length;
  return Math.round((completedLessons / lessons.length) * 100);
}; 