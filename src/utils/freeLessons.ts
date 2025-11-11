const parseFreeLessonIds = () => {
  const envValue = process.env.NEXT_PUBLIC_FREE_LESSON_IDS;
  if (!envValue) {
    return ['1'];
  }

  return envValue
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
};

export const FREE_LESSON_IDS = parseFreeLessonIds();

export const isFreeLesson = (lessonId?: string | number | null) => {
  if (lessonId === undefined || lessonId === null) {
    return false;
  }

  const normalized = String(lessonId).trim();
  return FREE_LESSON_IDS.includes(normalized);
};

