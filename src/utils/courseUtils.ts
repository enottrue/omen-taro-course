/**
 * Course utilities for managing course-related operations
 */

/**
 * Get the default course ID from environment variables
 * @returns The course ID as a number, defaults to 7 if not set
 */
export const getDefaultCourseId = (): number => {
  const courseId = process.env.COURSE_ID || '7';
  return parseInt(courseId, 10);
};

/**
 * Get the default course ID as a string
 * @returns The course ID as a string, defaults to '7' if not set
 */
export const getDefaultCourseIdString = (): string => {
  return process.env.COURSE_ID || '7';
};

/**
 * Validate if a course ID is valid
 * @param courseId - The course ID to validate
 * @returns True if the course ID is valid, false otherwise
 */
export const isValidCourseId = (courseId: string | number): boolean => {
  const id = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
  return !isNaN(id) && id > 0;
}; 