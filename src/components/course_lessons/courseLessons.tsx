import { CoursePdfItem } from '@/components/course_manual/courseManual';
import CourseListItem from '@/components/course_list_item/courseListItem';

const lessons = [
  {
    contentTitle: [
      {
        number: 1,
        content: '1.1. История создания колоды Таро А.Э.Уэйта.',
      },
      {
        number: 1,
        content: '1.2. История создания колоды Таро А.Э.Уэйта.',
      },
    ],
    counter: 1,
    title: 'История создания колоды.',
  },
  {
    contentTitle: [
      {
        number: 1,
        content: '2.1. История создания колоды Таро А.Э.Уэйта.',
      },
    ],
    counter: 2,
    title: 'Ритуальная подготовка перед работой с таро.',
  },
  {
    contentTitle: [
      {
        number: 1,
        content: '3.1. История создания колоды Таро А.Э.Уэйта.',
      },
    ],
    counter: 3,
    title: 'Значения арканов. Старшие арканы.',
  },
];

export const CourseLessons = () => (
  <>
    <section className="cource-lessons bg-white">
      <CoursePdfItem />
      {lessons.map((lesson, i) => {
        return (
          <CourseListItem
            contentTitle={lesson.contentTitle}
            counter={lesson.counter}
            title={lesson.title}
            key={i}
          />
        );
      })}
    </section>
    <div className="cource-bottom-bg"> </div>
  </>
);

export default CourseLessons;
