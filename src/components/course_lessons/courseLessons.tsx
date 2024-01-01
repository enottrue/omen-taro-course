import { CoursePdfItem } from '@/components/course_manual/courseManual';
import CourseListItem from '@/components/course_list_item/courseListItem';
import { Key } from 'react';
import { useQuery } from '@apollo/client';
import { GET_STAGE_STATUS } from '@/graphql/queries';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
 

// const lessons = [
//   {
//     contentTitle: [
//       {
//         number: 1,
//         content: '1.1. История создания колоды Таро А.Э.Уэйта.',
//       },
//       {
//         number: 1,
//         content: '1.2. История создания колоды Таро А.Э.Уэйта.',
//       },
//     ],
//     counter: 1,
//     title: 'История создания колоды.',
//   },
//   {
//     contentTitle: [
//       {
//         number: 1,
//         content: '2.1. История создания колоды Таро А.Э.Уэйта.',
//       },
//     ],
//     counter: 2,
//     title: 'Ритуальная подготовка перед работой с таро.',
//   },
//   {
//     contentTitle: [
//       {
//         number: 1,
//         content: '3.1. История создания колоды Таро А.Э.Уэйта.',
//       },
//     ],
//     counter: 3,
//     title: 'Значения арканов. Старшие арканы.',
//   },
// ];

export const CourseLessons = (lessons: { [k: string]: any }, userId?: any) => {
  const cc = useContext(MainContext);
  // console.log(
  //   'lessons',
  //   lessons.lessons,
  //   'userId',
  //   cc?.userId,
  //   'stage',
  //   cc?.stageData,
  // );
 
  return (
    <>
      <section className="cource-lessons bg-white">
        <CoursePdfItem />
        {lessons.lessons.map((lesson: any, i: Key) => {
          return (
            <CourseListItem
              contentStages={lesson.lessonStages}
              counter={lesson.lessonNumber}
              title={lesson.lessonName}
              lessonNumber={lesson.lessonNumber}
              key={i}
            />
          );
        })}
      </section>
      <div className="cource-bottom-bg"> </div>
    </>
  );
};

export default CourseLessons;
