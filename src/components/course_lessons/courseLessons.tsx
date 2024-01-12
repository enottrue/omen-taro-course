import { CoursePdfItem } from '@/components/course_manual/courseManual';
import CourseListItem from '@/components/course_list_item/courseListItem';
import { Key } from 'react';
import { useQuery } from '@apollo/client';
import { GET_STAGE_STATUS } from '@/graphql/queries';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

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
