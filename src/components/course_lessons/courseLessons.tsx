import { CoursePdfItem } from '@/components/course_manual/courseManual';
import { Key } from 'react';
import { useQuery } from '@apollo/client';
import { GET_STAGE_STATUS } from '@/graphql/queries';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

export const CourseLessons = ({ lessons }: { lessons?: any[] }) => {
  const cc = useContext(MainContext);

  return (
    <div className="frame-parent4">
      <CoursePdfItem lessons={lessons} />
    </div>
  );
};

export default CourseLessons;
