export const coursesData = [
  {
    id: 1,
    name: 'Обучающий курс по Таро для колоды карт таро Omen',
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
    lessonName: 'История создания колоды',
    lessonDescription: 'This is the description for Lesson 1',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 2,
    lessonNumber: 2,
    lessonName: 'Ритуальная подготовка к работе с Таро',
    lessonDescription: 'This is the description for Lesson 2',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 3,
    lessonNumber: 3,
    lessonName: 'Значения Арканов. Старшие Арканы',
    lessonDescription: 'This is the description for Lesson 3',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 4,
    lessonNumber: 4,
    lessonName: 'Значения Арканов. Младшие Арканы',
    lessonDescription: 'This is the description for Lesson 4',
    lessonTimecodes: ['00:00', '01:00', '02:00'],
    courseId: 1,
  },
  {
    id: 5,
    lessonNumber: 5,
    lessonName: 'Коллекция раскладов',
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
    stageName: 'История создания колоды Таро Уэйта',
    stageDescription: `У вас в руках копия легендарных карт таро Уэйта, созданных в 1910 году Памелой Смит и Артуром Уэйтом. Пожалуй, это самая известная колода в мире. Она не перестает удивлять своей многогранностью, глубиной и в то же время простотой. Эзотерики по всему миру ценят те магические знания, которые в ней заложены.

Необходимый этап для знакомства с системой Таро и колоды Уэйта в частности – изучение истории ее создания. 

Приятного просмотра!`,
    lessonId: 1,
    stageTimecodes: [
      {
        id: 1,
        stageId: 1,
        name: 'Заставка',
        timeCodeStart: '0:00-0:08',
        timeCodeEnd: '0:08',
      },
      {
        id: 2,
        stageId: 1,

        name: 'Первое в мире оккультное Таро. Колода Уэйта-Смит',
        timeCodeStart: '0:08',
        timeCodeEnd: '1:48',
      },
      {
        id: 3,
        name: 'Почему колода попала в массовую печать?',
        stageId: 1,

        timeCodeStart: '1:48',
        timeCodeEnd: '3:19',
      },
      {
        id: 4,
        name: 'Оригинал и последующие копии: в чем отличия?',
        stageId: 1,

        timeCodeStart: '3:19',
        timeCodeEnd: '5:41',
      },
      {
        id: 5,
        stageId: 1,

        name: 'Как родилось магическое Таро',
        timeCodeStart: '5:41',
        timeCodeEnd: '8:11',
      },
      {
        id: 6,
        stageId: 1,

        name: 'Ключевой Аркан. Космическое женское начало',
        timeCodeStart: '8:11',
        timeCodeEnd: '11:06',
      },
      {
        id: 7,
        stageId: 1,

        name: 'Куда «пропала» оригинальная колода?',
        timeCodeStart: '11:06',
        timeCodeEnd: '13:46',
      },
      {
        id: 8,
        stageId: 1,

        name: 'Магическое семя Таро',
        timeCodeStart: '13:46',
        timeCodeEnd: '15:36',
      },
      {
        id: 9,
        stageId: 1,

        name: 'Алхимия — единение противоположностей',
        timeCodeStart: '15:36',
        timeCodeEnd: '19:12',
      },
    ],
  },
  {
    id: 2,
    stageNumber: 2,
    stageName: 'Преимущества работы с Таро',
    stageDescription: `У вас в руках копия легендарных карт таро Уэйта, созданных в 1910 году Памелой Смит и Артуром Уэйтом. Пожалуй, это самая известная колода в мире. Она не перестает удивлять своей многогранностью, глубиной и в то же время простотой. Эзотерики по всему миру ценят те магические знания, которые в ней заложены.

Необходимый этап для знакомства с системой Таро и колоды Уэйта в частности – изучение истории ее создания. 

Приятного просмотра!`,
    lessonId: 1,
    stageTimecodes: [
      {
        id: 1,
        stageId: 2,
        name: 'Заставка',
        timeCodeStart: '0:00',
        timeCodeEnd: '0:08',
      },
      {
        id: 2,
        stageId: 2,

        name: 'Преимущества работы с ритуальным Таро',
        timeCodeStart: '0:08',
        timeCodeEnd: '2:10',
      },
      {
        id: 3,
        stageId: 2,

        name: 'Старшие Арканы магического Таро. Мир духа и мир людей',
        timeCodeStart: '2:10',
        timeCodeEnd: '4:21',
      },
      {
        id: 4,
        stageId: 2,

        name: 'Младшие Арканы. События, обстоятельства, реакции',
        timeCodeStart: '4:21',
        timeCodeEnd: '6:15',
      },
      {
        id: 5,
        stageId: 2,

        name: 'Как с помощью магического Таро можно влиять на судьбу',
        timeCodeStart: '6:15',
        timeCodeEnd: '8:53',
      },
    ],
  },
  {
    id: 3,
    stageNumber: 3,
    stageName: 'Ритуальное Таро Памелы Смит и магическое искусство Викка',
    stageDescription: `У вас в руках копия легендарных карт таро Уэйта, созданных в 1910 году Памелой Смит и Артуром Уэйтом. Пожалуй, это самая известная колода в мире. Она не перестает удивлять своей многогранностью, глубиной и в то же время простотой. Эзотерики по всему миру ценят те магические знания, которые в ней заложены.

Необходимый этап для знакомства с системой Таро и колоды Уэйта в частности – изучение истории ее создания. 

Приятного просмотра!`,
    lessonId: 1,
    stageTimecodes: [
      {
        id: 1,
        stageId: 3,

        name: 'Заставка',
        timeCodeStart: '0:00',
        timeCodeEnd: '0:08',
      },
      {
        id: 2,
        stageId: 3,

        name: 'Ритуальное Таро Памелы Смит и магическое искусство Викка',
        timeCodeStart: '0:08',
        timeCodeEnd: '2:50',
      },
      {
        id: 3,
        stageId: 3,

        name: 'Древние богини в женских Арканах',
        timeCodeStart: '2:50',
        timeCodeEnd: '5:32',
      },
    ],
  },
  {
    id: 4,
    stageNumber: 2,
    stageName: 'Ритуальная подготовка к работе с Таро',
    stageDescription: ``,
    lessonId: 2,
    stageTimecodes: [
      {
        id: 1,
        stageId: 4,
        name: 'Заставка',
        timeCodeStart: '0:00',
        timeCodeEnd: '0:08',
      },
      {
        id: 2,
        stageId: 4,

        name: 'Ритуальная подготовка к работе с Таро. Зачем она нужна?',
        timeCodeStart: '0:08',
        timeCodeEnd: '2:56',
      },
      {
        id: 3,
        stageId: 4,

        name: 'Как создать свой собственный ритуал',
        timeCodeStart: '2:56',
        timeCodeEnd: '3:54',
      },
      {
        id: 4,
        stageId: 4,

        name: 'Сценарии ритуалов магических, религиозных и мистических традиций',
        timeCodeStart: '3:54',
        timeCodeEnd: '4:51',
      },
    ],
  },
  {
    id: 5,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 3,
    stageTimecodes: [],
  },
  {
    id: 6,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 3,
    stageTimecodes: [],
  },
  {
    id: 7,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 4,
    stageTimecodes: [],
  },
  {
    id: 8,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 4,
    stageTimecodes: [],
  },
  {
    id: 9,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 5,
    stageTimecodes: [],
  },
  {
    id: 10,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 5,
    stageTimecodes: [],
  },
  {
    id: 11,
    stageNumber: 1,
    stageName: 'The first stage',
    lessonId: 6,
    stageTimecodes: [],
  },
  {
    id: 12,
    stageNumber: 2,
    stageName: 'The second stage',
    lessonId: 6,
    stageTimecodes: [],
  },
];
