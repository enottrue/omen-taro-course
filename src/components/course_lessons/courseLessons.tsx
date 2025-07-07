import { CoursePdfItem } from '@/components/course_manual/courseManual';
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
    <div className="frame-parent4">
      <CoursePdfItem lessons={lessons?.lessons} />
    </div>
  );
};

export default CourseLessons;
