export const coursesData = [
  {
    id: 1,
    name: 'Main course',
  },
  // Add more courses as needed
];

// model Lesson {
//   id              Int      @id @default(autoincrement())
//   lessonNumber    Int
//   lessonName      String
//   lessonStages    Stage[]
//   lessonTimecodes String[]
//   lessonStatus    String   @default("new")
//   courseId        Int
//   course          Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
//   createdAt       DateTime @default(now())
//   updatedAt       DateTime @updatedAt
// }

export const lessonsData = [
  {
    id: 1,
    lessonNumber: 1,
    lessonName: 'Lesson 1',
    lessonDescription: 'This is the description for Lesson 1',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 2,
    lessonNumber: 2,
    lessonName: 'Lesson 2',
    lessonDescription: 'This is the description for Lesson 2',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 3,
    lessonNumber: 3,
    lessonName: 'Lesson 3',
    lessonDescription: 'This is the description for Lesson 3',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 4,
    lessonNumber: 4,
    lessonName: 'Lesson 4',
    lessonDescription: 'This is the description for Lesson 4',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 5,
    lessonNumber: 5,
    lessonName: 'Lesson 5',
    lessonDescription: 'This is the description for Lesson 5',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 6,
    lessonNumber: 6,
    lessonName: 'Lesson 6',
    lessonDescription: 'This is the description for Lesson 6',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
];

export const stageData = [
  {
    id: 1,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 1,
  },
  {
    id: 2,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 1,
  },
  {
    id: 3,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 2,
  },
  {
    id: 4,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 2,
  },
  {
    id: 5,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 3,
  },
  {
    id: 6,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 3,
  },
  {
    id: 7,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 4,
  },
  {
    id: 8,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 4,
  },
  {
    id: 9,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 5,
  },
  {
    id: 10,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 5,
  },
  {
    id: 11,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 6,
  },
  {
    id: 12,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 6,
  },
];
