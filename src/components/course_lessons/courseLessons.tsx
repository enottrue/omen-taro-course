import { CoursePdfItem } from '@/components/course_manual/courseManual';
import { Key } from 'react';
import { useQuery } from '@apollo/client';
import { GET_STAGE_STATUS } from '@/graphql/queries';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import Image from 'next/image';
import laptopCourses from '../../images/laptop-courses.png';
import { getDefaultCourseIdString } from '@/utils/courseUtils';


export const CourseLessons = ({ lessons }: { lessons?: any[] }) => {
  const cc = useContext(MainContext);
  
  // Проверяем авторизацию пользователя
  const userId = cc?.userId;
  const user = cc?.user;
  const isUserAuthorized = userId && user && user.id;
  
  console.log('CourseLessons received lessons:', lessons?.length || 0);
  console.log('User authorized:', isUserAuthorized);

  return (
    <div className="course-lessons-outer-wrapper" style={{ position: 'relative', width: '100%', maxWidth: 370, margin: '0 auto' }}>
      {/* Laptop image above the card, overlapping as in Figma */}
      <div className="course-lessons__laptop-img-wrapper">
        <Image 
          src={laptopCourses} 
          alt="Laptop with astrology course" 
          width={370} 
          height={321} 
          className="course-lessons__laptop-img"
          style={{ pointerEvents: 'none' }}
        />
      </div>
     
       <div className="frame-parent4">
        <CoursePdfItem lessons={isUserAuthorized ? lessons : undefined} />
      </div> 
    </div>
  );
};

export default CourseLessons;
